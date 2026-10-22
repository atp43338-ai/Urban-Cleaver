import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUrl';
import toast from 'react-hot-toast';

/**
 * HomeProductCard:
 * Compact product card designed for 5-per-row shelves matching the visual reference:
 * - Aspect-square image container with floating red "Save ₹X" discount badge
 * - 2-line clamped product title and net weight indicator
 * - Bold discounted price alongside strike-through original price
 * - Full-width compact red "Add to cart" button
 */
const HomeProductCard = ({ product }) => {
  if (!product) return null;

  const id = product._id || product.id;
  const price = Number(product.price || 0);
  // Calculate original price (approx 20% higher for promotional display)
  const originalPrice = Math.round(price * 1.25);
  const discountAmount = originalPrice - price;

  const imageSrc =
    Array.isArray(product.images) && product.images.length > 0
      ? getFullImageUrl(product.images[0])
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isStock) {
      toast.error('Currently out of stock');
      return;
    }
    toast.success(`Added ${product.name} to your cart!`);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-zinc-300 hover:shadow-sm transition-all duration-200 group text-left relative">
      {/* Top Image Frame */}
      <Link to={`/product/${id}`} className="block relative w-full aspect-square rounded-lg bg-zinc-100 overflow-hidden mb-2.5">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <ImageIcon size={24} />
          </div>
        )}

        {/* Floating Discount Pill Badge */}
        {discountAmount > 0 ? (
          <span className="absolute top-2 left-2 bg-[#b91c1c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase">
            Save ₹{discountAmount}
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase">
            Fresh Cut
          </span>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            to={`/product/${id}`}
            className="block text-xs sm:text-[13px] font-medium text-zinc-900 group-hover:text-black line-clamp-2 leading-snug mb-1 min-h-[32px] sm:min-h-[36px]"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Net Usable Weight / Cut Tag */}
          <p className="text-[11px] text-zinc-500 font-medium mb-1.5 truncate">
            {product.netWeight || '1000g'} &bull; Pan Ready
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-1">
          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm sm:text-base font-extrabold text-black font-mono">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice > price && (
              <span className="text-[11px] text-zinc-400 line-through font-mono">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.isStock}
            className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer shadow-2xs ${
              product.isStock
                ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-white'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
            }`}
          >
            <ShoppingCart size={13} />
            <span>{product.isStock ? 'Add to cart' : 'Out of stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;
