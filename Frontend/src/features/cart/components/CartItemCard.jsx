import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUrl';

/**
 * CartItemCard:
 * - Left-aligned product thumbnail
 * - Title, selected variant/cut style, net weight
 * - Price formatted with ₹ symbol
 * - Quantity increment/decrement controller (- 1 +)
 * - Red accent "Remove" action button
 */
const CartItemCard = ({ item, onUpdateQty, onRemove, isUpdating = false }) => {
  if (!item) return null;

  const product = item.product || {};
  const itemId = item._id || item.id;
  const productId = product._id || product.id;
  const cutStyle = item.cutStyle || 'Standard Cut';
  const quantity = Number(item.quantity || 1);
  const unitPrice = Number(item.price ?? product.price ?? 0);
  const itemTotal = unitPrice * quantity;

  const imageSrc =
    Array.isArray(product.images) && product.images.length > 0
      ? getFullImageUrl(product.images[0])
      : null;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 hover:border-zinc-300 shadow-2xs">
      {/* Product Image & Details (Left) */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Link
          to={`/product/${productId}`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100 block group"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name || 'Meat cut'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <ImageIcon size={22} />
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0 space-y-1">
          <Link
            to={`/product/${productId}`}
            className="font-bold text-sm sm:text-base text-zinc-900 hover:text-black transition-colors line-clamp-1 block tracking-tight"
          >
            {product.name || 'Artisanal Cut'}
          </Link>

          {/* Variant / Cut Style & Net Weight */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
              Cut: {cutStyle}
            </span>
            {product.netWeight && (
              <span className="text-[11px] text-zinc-500 font-mono">
                Net: {product.netWeight}
              </span>
            )}
          </div>

          {/* Unit Price */}
          <p className="text-xs text-zinc-500 font-mono pt-0.5">
            Unit Price: <span className="font-semibold text-zinc-900">₹{unitPrice}</span>
          </p>

          {/* Mobile Remove Button */}
          <div className="sm:hidden pt-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onRemove(itemId, product.name)}
              className="inline-flex items-center gap-1 text-xs text-[#b91c1c] hover:text-red-700 font-medium cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quantity Controller & Price Total (Right) */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
        {/* Quantity Increment/Decrement Controller */}
        <div className="flex items-center border border-zinc-200 bg-zinc-50 rounded-lg p-0.5">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateQty(itemId, quantity - 1)}
            aria-label="Decrease quantity"
            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-white rounded-md transition-colors cursor-pointer disabled:opacity-40"
          >
            <Minus size={13} />
          </button>

          <span className="w-9 text-center text-xs sm:text-sm font-semibold font-mono text-zinc-900 select-none">
            {quantity}
          </span>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateQty(itemId, quantity + 1)}
            aria-label="Increase quantity"
            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-white rounded-md transition-colors cursor-pointer disabled:opacity-40"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right">
          <span className="block text-base sm:text-lg font-bold text-zinc-900 font-mono tracking-tight">
            ₹{itemTotal}
          </span>
        </div>

        {/* Desktop Red Accent Remove Button */}
        <div className="hidden sm:block">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onRemove(itemId, product.name)}
            className="inline-flex items-center gap-1 text-xs text-[#b91c1c] hover:text-red-700 font-medium cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
