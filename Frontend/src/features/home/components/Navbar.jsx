import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { useCart } from '../../cart/context/CartContext';
import {
  Search,
  MapPin,
  Heart,
  User,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  X,
} from 'lucide-react';
import navLogo from '../assets/Nav-logo.png';
import toast from 'react-hot-toast';

/**
 * Navbar:
 * Dark cinematic fixed navigation bar matching the visual design reference:
 * - Fixed positioning at top (z-50) with dark theme (#1c1c1c)
 * - Crossed cleaver logo asset alongside clean stacked typography "Urban Cleaver"
 * - Dark minimal search bar container (#282828) with right-aligned magnifying glass
 * - Action icons: Location Pin, Wishlist with plus badge, User Profile, and Cart badge
 */
const Navbar = ({
  search = '',
  onSearchChange,
  cartCount: propCartCount,
  selectedLocation = 'Select Location',
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount: liveCartCount } = useCart();
  const cartCount = propCartCount !== undefined && propCartCount > 0 ? propCartCount : liveCartCount;
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  const handleLocationClick = () => {
    toast('Express butcher cold-chain delivery active in your area (30–45 mins).', {
      icon: '📍',
    });
  };

  const handleWishlistClick = () => {
    toast('Cuts Wishlist: Save your favorite steaks and curries.', {
      icon: '🤍',
    });
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1c1c1c] text-white h-20 border-b border-zinc-800 select-none shadow-md">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* ================= LEFT: BRAND LOGO ================= */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src={navLogo}
            alt="Urban Cleaver"
            className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
              Urban
            </span>
            <span className="font-extrabold text-base sm:text-lg text-white tracking-tight -mt-1">
              Cleaver
            </span>
          </div>
        </Link>

        {/* ================= MIDDLE: SEARCH BAR ================= */}
        <div className="flex-1 max-w-md lg:max-w-lg mx-2 sm:mx-6">
          <div className="relative flex items-center bg-[#282828] text-zinc-300 rounded-md border border-zinc-700/60 px-3.5 py-2 focus-within:border-zinc-500 focus-within:bg-[#2e2e2e] transition">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none pr-6"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className="text-zinc-400 hover:text-white cursor-pointer mr-1.5"
                title="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}
            <Search size={17} className="text-zinc-400 shrink-0 pointer-events-none" />
          </div>
        </div>

        {/* ================= RIGHT: ACTION ICONS ================= */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* 1. Location Pin */}
          <button
            type="button"
            onClick={handleLocationClick}
            className="text-zinc-300 hover:text-white transition p-1 cursor-pointer relative"
            title="Choose delivery location"
          >
            <MapPin size={21} className="stroke-[1.8]" />
          </button>

          {/* 2. Wishlist with Plus Badge */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className="relative text-zinc-300 hover:text-white transition p-1 cursor-pointer"
            title="Wishlist"
          >
            <Heart size={21} className="stroke-[1.8]" />
            <span className="absolute -top-0.5 -right-0.5 text-[11px] font-black leading-none text-white font-mono">
              +
            </span>
          </button>

          {/* 3. User Avatar Profile */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-[#2e2e2e] border border-zinc-700 text-white flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:border-zinc-500 transition"
                title={user?.name || 'Account'}
              >
                {user?.name ? user.name.charAt(0) : <User size={16} />}
              </button>
            ) : (
              <Link
                to="/login"
                className="text-zinc-300 hover:text-white transition p-1 block cursor-pointer"
                title="Sign In / Register"
              >
                <User size={21} className="stroke-[1.8]" />
              </Link>
            )}

            {/* Profile Dropdown Menu */}
            {isAuthenticated && showProfileMenu && (
              <div
                className="absolute right-0 mt-3 w-48 bg-[#1f1f1f] border border-zinc-700 rounded-xl shadow-2xl py-2 z-50 text-xs text-zinc-200 animate-in fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                </div>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
                  >
                    <LayoutDashboard size={14} />
                    <span>Admin Console</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Cart with Item Counter Badge */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative text-zinc-300 hover:text-white transition p-1 cursor-pointer"
            title="Cart"
          >
            <ShoppingCart size={21} className="stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-white text-black font-mono text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
