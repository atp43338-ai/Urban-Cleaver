import React from 'react';
import { Check, Plus, Minus, Package, Image as ImageIcon } from 'lucide-react';
import { getFullImageUrl } from '../../../../utils/imageUrl';

/**
 * RecipeKitCard:
 * Selectable micro-card representing a pre-portioned cooking add-on kit
 * (e.g., Shallots, Coconut Slices, Biryani Spices)
 */
const RecipeKitCard = ({
  item,
  isSelected = false,
  quantity = 1,
  onToggleSelect,
  onQuantityChange,
}) => {
  const imageSrc = item.imageUrl ? getFullImageUrl(item.imageUrl) : null;

  const handleCardClick = (e) => {
    // If click originated from quantity stepper buttons, do not toggle selection
    if (e.target.closest('.quantity-stepper')) return;
    onToggleSelect(item);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      onQuantityChange(item._id, quantity - 1);
    } else {
      // Decrementing from 1 unselects
      onToggleSelect(item);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (quantity < 10) {
      onQuantityChange(item._id, quantity + 1);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative rounded-2xl p-3.5 transition-all duration-200 cursor-pointer select-none flex flex-col justify-between group ${
        isSelected
          ? 'border-2 border-black bg-zinc-50 shadow-xs'
          : 'border border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
      }`}
    >
      <div>
        {/* Top Header: Category Tag & Selection Checkbox Indicator */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
            {item.category === 'dairy_oils'
              ? 'Dairy & Oils'
              : item.category === 'spices'
              ? 'Spices'
              : item.category === 'produce'
              ? 'Fresh Produce'
              : 'Essentials'}
          </span>

          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
              isSelected
                ? 'bg-black text-white'
                : 'border border-zinc-300 bg-white group-hover:border-zinc-500'
            }`}
          >
            {isSelected && <Check size={12} strokeWidth={3} />}
          </div>
        </div>

        {/* Thumbnail & Title Row */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon size={20} className="text-zinc-300" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="text-xs font-bold text-black tracking-tight leading-snug">
              {item.name}
            </h4>
            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-tight">
              {item.portionSize}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Price & Quantity Stepper */}
      <div className="mt-3.5 pt-2.5 border-t border-zinc-200/70 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
            Pack Price
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black font-mono text-black">
              +₹{Number(item.price).toFixed(2)}
            </span>
            {quantity > 1 && isSelected && (
              <span className="text-[10px] font-mono text-zinc-500">
                (&times;{quantity} = ₹{(Number(item.price) * quantity).toFixed(2)})
              </span>
            )}
          </div>
        </div>

        {/* Quantity Stepper (Shows when item is selected) */}
        {isSelected ? (
          <div className="quantity-stepper flex items-center gap-1.5 bg-white border border-black rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-6 h-6 rounded flex items-center justify-center text-zinc-700 hover:text-black hover:bg-zinc-100 transition cursor-pointer"
              title="Decrease quantity"
            >
              <Minus size={11} strokeWidth={2.5} />
            </button>
            <span className="w-5 text-center text-xs font-bold font-mono text-black">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-6 h-6 rounded flex items-center justify-center text-zinc-700 hover:text-black hover:bg-zinc-100 transition cursor-pointer"
              title="Increase quantity"
            >
              <Plus size={11} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-zinc-500 group-hover:text-black transition flex items-center gap-1">
            <Plus size={12} />
            <span>Add to Cook</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default RecipeKitCard;
