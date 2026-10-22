import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/CartItemCard';
import CartSummary from '../components/CartSummary';
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight } from 'lucide-react';

/**
 * Cart:
 * Main Customer Cart Page
 * - Two-column responsive layout (lg:flex-row gap-8)
 * - Left: Cart Item cards list
 * - Right: Sticky CartSummary
 * - Empty state with "Browse Cuts" redirect
 */
const Cart = () => {
  const {
    cartItems,
    cartCount,
    cartSummary,
    loading,
    isUpdating,
    updateQty,
    removeFromCart,
    clearCart,
  } = useCart();

  // Loading skeleton
  if (loading && cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-8 bg-zinc-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-xl p-5 h-28 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 h-80 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Clean Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white border border-zinc-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-6">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Your cart is empty
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Explore our precision-butchered cuts with 100% net usable weight standards. What you order is exactly what you cook.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs sm:text-sm rounded-lg tracking-wider uppercase transition shadow-sm cursor-pointer"
          >
            <span>Browse Cuts</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Your Cart
              </h1>
              <span className="bg-zinc-900 text-white text-xs font-bold font-mono px-2.5 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              Cold-chain packed &bull; 100% Net usable weight assurance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-black font-medium transition"
            >
              <ArrowLeft size={13} />
              <span>Continue Shopping</span>
            </Link>

            <button
              type="button"
              disabled={isUpdating}
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-600 font-medium transition cursor-pointer ml-2"
              title="Empty entire cart"
            >
              <Trash2 size={13} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Left (Items List) | Right (Cart Summary) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <main className="flex-1 w-full space-y-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item._id || item.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
                isUpdating={isUpdating}
              />
            ))}

            {/* Bottom auxiliary link */}
            <div className="pt-4 flex items-center justify-between text-xs text-zinc-500">
              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-black font-semibold hover:underline"
              >
                + Add more artisanal cuts
              </Link>
              <span>Prices include all applicable taxes</span>
            </div>
          </main>

          {/* Right Column: Sticky Cart Summary */}
          <aside className="w-full lg:w-96 shrink-0">
            <CartSummary
              summary={cartSummary}
              disabled={isUpdating || cartItems.length === 0}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
