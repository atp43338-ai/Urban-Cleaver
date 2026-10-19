import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

/**
 * Dedicated Standalone Auth Layout
 * Minimal, ultra-clean light theme container strictly without public Navbar or Footer.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
      {/* Centered Brand Header */}
      <div className="mb-8 text-center animate-fadeIn">
        <Link
          to="/"
          className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 rounded-xl px-2 py-1 transition"
          aria-label="Urban Cleaver Home"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Flame size={22} className="stroke-[2.2]" />
          </div>
          <span className="text-xl font-extrabold tracking-[0.2em] text-slate-900 uppercase">
            URBAN CLEAVER
          </span>
        </Link>
      </div>

      {/* Standalone Card Container */}
      <main className="w-full max-w-md animate-fadeIn">
        {children || <Outlet />}
      </main>

      {/* Minimal Footer Notice */}
      <footer className="mt-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Urban Cleaver Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
