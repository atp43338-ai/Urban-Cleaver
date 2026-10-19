import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { LogOut, User, ShieldCheck, Flame, LayoutDashboard, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-xs transition group-hover:scale-105">
            <Flame size={17} strokeWidth={2.2} />
          </div>
          <div>
            <span className="font-black text-black tracking-wider text-sm block leading-none">
              URBAN CLEAVER
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mt-0.5">
              Precision Butchery
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 text-xs font-semibold rounded-lg transition"
                >
                  <LayoutDashboard size={13} /> Admin Console
                </Link>
              )}

              {/* User Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800">
                <div className="w-5 h-5 rounded-full bg-zinc-200 text-black flex items-center justify-center font-bold text-[10px] uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="font-semibold text-black max-w-28 truncate">{user?.name}</span>
                {user?.isVerified && (
                  <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.2 rounded font-mono hidden md:inline">
                    Verified
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:text-black transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition active:scale-[0.98] shadow-xs"
              >
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
