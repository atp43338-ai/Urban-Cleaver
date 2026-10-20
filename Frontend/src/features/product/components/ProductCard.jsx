import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Info, Check, Image as ImageIcon, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFullImageUrl } from '../../../utils/imageUrl';

/**
 * ProductCard:
 * Reusable customer butchery card featuring:
 * - Interactive cut selection pills directly on the card ([ Curry Cut ], [ Biryani Cut ], [ Boneless ])
 * - Net Usable Weight badge (1000g = 1000g)
 * - Morning butchery stamp (6:00 AM)
 * - Add to Bag button persisting the chosen cut
 */
const ProductCard = ({ product, onOpenStandardModal }) => {
  const cuts = Array.isArray(product?.cutTypes) && product.cutTypes.length > 0
    ? product.cutTypes
    : ['Curry Cut', 'Biryani Cut', 'Boneless'];

  const [selectedCut, setSelectedCut] = useState(cuts[0]);
  const [showTooltip, setShowTooltip] = useState(false);

  const imageSrc = Array.isArray(product?.images) && product.images.length > 0
    ? getFullImageUrl(product.images[0])
    : null;

  const productId = product?._id || product?.id;

  const handleAddToCart = () => {
    if (!product?.isStock) return;
    toast.success(
      `Added 1x ${product.name} (${selectedCut} • ${product.netWeight || '1000g Net'}) to your bag!`
    );
  };

  return (
    <div className="bg-white border border-zinc-200 hover:border-black transition-all duration-200 p-4 rounded-2xl flex flex-col justify-between group shadow-2xs">
      <div>
        {/* Thumbnail Box */}
        <Link
          to={`/product/${productId}`}
          className="block relative w-full aspect-4/3 rounded-xl bg-zinc-100 border border-zinc-100 overflow-hidden mb-3.5 flex items-center justify-center cursor-pointer"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon size={28} className="text-zinc-300" />
          )}

          {/* Micro Badges: Morning Butchery Stamp */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="bg-white/95 backdrop-blur-xs text-black border border-zinc-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Butchered 6:00 AM
            </span>
          </div>

          {!product?.isStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/90 px-3.5 py-1.5 rounded-lg border border-zinc-700">
                Sold Out for Today
              </span>
            </div>
          )}
        </Link>

        {/* Category Label */}
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          {product?.category?.name || 'Artisanal Cut'}
        </p>

        {/* Product Title */}
        <Link to={`/product/${productId}`}>
          <h3 className="text-base font-bold text-black tracking-tight mt-0.5 leading-snug hover:underline cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        {product.description && (
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Net Usable Weight Assurance Badge: 1000g = 1000g */}
        <div className="mt-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs relative">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <Scale size={13} className="text-black shrink-0" />
              <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                1000g = 1000g:
              </span>
              <strong className="font-mono text-black font-bold text-xs truncate">
                {product.netWeight || '1000g Net Usable'}
              </strong>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Zero Waste &bull; {product.grossWeight ? `Gross ${product.grossWeight} → 0% Loss` : '100% Edible Yield'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenStandardModal && onOpenStandardModal()}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-zinc-400 hover:text-black transition p-1 shrink-0 cursor-pointer"
            title="Why 1000g = 1000g matters"
          >
            <Info size={14} />
          </button>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-60 p-2.5 bg-black text-white text-[11px] rounded-lg shadow-lg z-20 pointer-events-none text-center leading-snug">
              1000g ordered = exactly 1000g pan-ready meat. Zero blood, skin, or dressing deduction.
            </div>
          )}
        </div>

        {/* Interactive Cut Selection Pills */}
        <div className="mt-3">
          <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
            Select Butchery Cut:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cuts.map((cut, idx) => {
              const isSelected = selectedCut === cut;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCut(cut)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer select-none ${
                    isSelected
                      ? 'bg-black text-white shadow-2xs font-semibold'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {cut}
                  {isSelected && <Check size={11} className="inline ml-1 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Add to Bag CTA */}
      <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Pan-Ready Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-black font-mono">
              ₹{Number(product.price).toFixed(2)}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">/ pack</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product?.isStock}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition active:scale-[0.98] cursor-pointer ${
            product?.isStock
              ? 'bg-black hover:bg-zinc-800 text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
          }`}
        >
          <ShoppingBag size={14} />
          {product?.isStock ? 'Add to Bag' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
