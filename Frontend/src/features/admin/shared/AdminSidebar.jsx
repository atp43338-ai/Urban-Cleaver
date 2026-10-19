import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Flame,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Flame size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white tracking-wider text-sm leading-tight">URBAN CLEAVER</span>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Admin Console</span>
          </div>
        </Link>
      </div>

      {/* Admin Profile Mini */}
      <div className="px-5 py-4 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs uppercase">
          {user?.name ? user.name.charAt(0) : 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-400" /> Administrator
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Management
        </div>

        {/* Dashboard Link */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`
          }
        >
          <LayoutDashboard size={16} />
          <span>Overview & Metrics</span>
        </NavLink>

        {/* Users Link */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`
          }
        >
          <Users size={16} />
          <span>User Accounts & Security</span>
        </NavLink>
      </nav>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <ExternalLink size={15} />
          <span>View Customer Store</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut size={15} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
