import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Flame, ShieldCheck, Truck, Scale, HeartHandshake } from 'lucide-react';

const UserLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans">
      {!isHomePage && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Customer Footer (Monochromatic) */}
      <footer className="bg-zinc-50 text-zinc-600 border-t border-zinc-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white">
                  <Flame size={15} strokeWidth={2.2} />
                </div>
                <span className="text-black font-black tracking-wider text-sm">URBAN CLEAVER</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Artisanal butcher shop engineered with 100% net usable weight standards. What you order is exactly what you cook.
              </p>
            </div>

            {/* Quality Standard */}
            <div>
              <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Our Standards</h4>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-center gap-2">
                  <Scale size={14} className="text-black shrink-0" /> 100% Net Usable Weight (Zero Dressing Loss)
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-black shrink-0" /> Antibiotic-Free Farm Sourcing
                </li>
                <li className="flex items-center gap-2">
                  <Truck size={14} className="text-black shrink-0" /> Continuous 0°C–4°C Cold-Chain Packing
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Customer Access</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/login" className="text-zinc-600 hover:text-black transition">
                    Customer Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-zinc-600 hover:text-black transition">
                    Register Account & Verify OTP
                  </Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="text-zinc-600 hover:text-black transition">
                    Password Recovery
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="text-zinc-400 hover:text-zinc-700 transition">
                    Staff & Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Security Guarantee */}
            <div>
              <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Integrity & Quality</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Clean-room cut, nitrogen-flushed packaging, and complete elimination of bone dust and dressing deductions.
              </p>
              <div className="mt-3.5 inline-flex items-center gap-1.5 text-black text-xs font-semibold bg-white border border-zinc-200 px-2.5 py-1 rounded-md shadow-2xs">
                <HeartHandshake size={14} /> FSSAI Certified Kitchens
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} Urban Cleaver Artisanal Butchery. All rights reserved.</span>
            <span className="font-mono text-[11px]">Nested Feature-Based Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;