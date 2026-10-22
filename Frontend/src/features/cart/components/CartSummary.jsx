import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * CartSummary:
 * Sticky sidebar displaying financial breakdown:
 * - Subtotal (sum of unit prices * quantities)
 * - Discount (e.g., - ₹0)
 * - Delivery Fee (Dynamic with Free threshold indicator)
 * - Bold Total Amount
 * - Full-width red CTA button "Proceed to Checkout"
 */
const CartSummary = ({
  summary = {},
  disabled = false,
  onProceedCheckout,
}) => {
  const {
    subtotal = 0,
    discount = 0,
    delivery = 0,
    total = 0,
    totalItems = 0,
    deliveryThreshold = 500,
    isFreeDelivery = false,
  } = summary;

  const amountNeededForFreeDelivery = Math.max(0, deliveryThreshold - subtotal);

  const handleCheckoutClick = () => {
    if (disabled || totalItems === 0) {
      toast.error('Your cart is empty. Add cuts before checkout.');
      return;
    }
    if (onProceedCheckout) {
      onProceedCheckout();
    } else {
      toast.success('Proceeding to cold-chain checkout...', {
        icon: '🥩',
      });
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs sticky top-28 space-y-5">
      {/* Header */}
      <div className="border-b border-zinc-100 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
          Order Summary
        </h3>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Free Delivery Incentive Meter */}
      {subtotal > 0 && (
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-zinc-700">
              <Truck size={14} className="text-zinc-600" />
              {isFreeDelivery ? 'Free Delivery Unlocked!' : 'Cold-Chain Delivery'}
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              {isFreeDelivery ? '₹0 Fee' : `Add ₹${amountNeededForFreeDelivery}`}
            </span>
          </div>

          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isFreeDelivery ? 'bg-emerald-500' : 'bg-black'
              }`}
              style={{
                width: `${Math.min(100, (subtotal / deliveryThreshold) * 100)}%`,
              }}
            ></div>
          </div>

          {!isFreeDelivery && (
            <p className="text-[11px] text-zinc-500">
              Add <strong className="text-zinc-800">₹{amountNeededForFreeDelivery}</strong> more to qualify for <strong>FREE Cold-Chain Delivery</strong>.
            </p>
          )}
        </div>
      )}

      {/* Line Items Breakdown */}
      <div className="space-y-3 text-xs sm:text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-zinc-600">
          <span>Subtotal</span>
          <span className="font-semibold text-zinc-900 font-mono">₹{subtotal}</span>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between text-zinc-600">
          <span>Discount</span>
          <span
            className={`font-semibold font-mono ${
              discount > 0 ? 'text-emerald-600' : 'text-zinc-400'
            }`}
          >
            {discount > 0 ? `- ₹${discount}` : '- ₹0'}
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="flex items-center justify-between text-zinc-600">
          <span>Delivery Fee</span>
          <span className="font-semibold font-mono">
            {subtotal === 0 ? (
              <span className="text-zinc-400">₹0</span>
            ) : isFreeDelivery || delivery === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
            ) : (
              `₹${delivery}`
            )}
          </span>
        </div>
      </div>

      {/* Total Row */}
      <div className="border-t border-zinc-200 pt-4 flex items-baseline justify-between">
        <div>
          <span className="text-sm font-bold text-zinc-900 block">Total</span>
          <span className="text-[10px] text-zinc-400">Inclusive of all taxes</span>
        </div>
        <span className="text-2xl font-extrabold text-zinc-900 font-mono tracking-tight">
          ₹{total}
        </span>
      </div>

      {/* CTA Button: Proceed to Checkout */}
      <button
        type="button"
        disabled={disabled || totalItems === 0}
        onClick={handleCheckoutClick}
        className="w-full py-3.5 px-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm rounded-lg tracking-wider uppercase shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight size={16} />
      </button>

      {/* Quality Standards Guarantee */}
      <div className="pt-2 border-t border-zinc-100 space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck size={14} className="text-black shrink-0" />
          <span>100% Net Usable Weight (Zero Dressing Loss)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Sparkles size={14} className="text-black shrink-0" />
          <span>Sterile vacuum packaging with cold-chain lock</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
