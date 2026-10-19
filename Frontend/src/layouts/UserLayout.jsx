import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Flame, ShieldCheck, Truck, Clock, HeartHandshake } from 'lucide-react';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Intro */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white">
                  <Flame size={18} />
                </div>
                <span className="text-white font-extrabold tracking-wider text-base">URBAN CLEAVER</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Premium artisanal butchery & gourmet cuts. Sourced fresh, vacuum-sealed, and delivered cold to your kitchen.
              </p>
            </div>

            {/* Quality Commitments */}
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Our Promise</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={14} className="text-orange-500 shrink-0" /> 100% Certified Antibiotic-Free
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Truck size={14} className="text-orange-500 shrink-0" /> Temperature-Controlled Transit
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} className="text-orange-500 shrink-0" /> WhatsApp Live Dispatch Updates
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Customer Support</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
                <li><Link to="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
              </ul>
            </div>

            {/* Security Notice */}
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Security & Trust</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All accounts protected with 6-digit email OTP verification and bcrypt 256-bit password hashing.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded">
                <HeartHandshake size={14} /> FSSAI Certified Standards
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Urban Cleaver Inc. All rights reserved. Built with Vertical Slice Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
