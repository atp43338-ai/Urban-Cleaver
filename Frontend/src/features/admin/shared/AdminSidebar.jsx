import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
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

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
      isActive
        ? 'bg-zinc-100 font-semibold text-black'
        : 'text-zinc-600 hover:text-black hover:bg-zinc-50 font-normal'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0 text-zinc-800 select-none">
      {/* Minimal Brand Header */}
      <div className="p-5 border-b border-zinc-200">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shrink-0">
            <Flame size={17} className="stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-black tracking-tight text-xs leading-tight">
              URBAN CLEAVER
            </span>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Admin Profile Strip */}
      <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2.5 bg-zinc-50/50">
        <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 text-black flex items-center justify-center font-bold text-xs uppercase shrink-0">
          {user?.name ? user.name.charAt(0) : 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-black truncate">{user?.name || 'Administrator'}</p>
          <p className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
            <ShieldCheck size={11} className="text-zinc-700" /> Admin Role
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
          Catalog & Inventory
        </div>

        {/* Dashboard Link */}
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
          <LayoutDashboard size={16} className="stroke-1.5" />
          <span>Overview & Metrics</span>
        </NavLink>

        {/* Products Link */}
        <NavLink to="/admin/products" className={navLinkClasses}>
          <Package size={16} className="stroke-1.5" />
          <span>Products & Cuts</span>
        </NavLink>

        {/* Categories Link */}
        <NavLink to="/admin/categories" className={navLinkClasses}>
          <FolderTree size={16} className="stroke-1.5" />
          <span>Categories & Depts</span>
        </NavLink>

        <div className="px-3 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
          Access & Security
        </div>

        {/* Users Link */}
        <NavLink to="/admin/users" className={navLinkClasses}>
          <Users size={16} className="stroke-1.5" />
          <span>Customer Accounts</span>
        </NavLink>
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-zinc-200 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-600 hover:text-black hover:bg-zinc-50 transition"
        >
          <ExternalLink size={14} className="stroke-1.5 text-zinc-400" />
          <span>Customer Storefront</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-black hover:bg-zinc-100 transition cursor-pointer"
        >
          <LogOut size={14} className="stroke-1.5 text-zinc-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
