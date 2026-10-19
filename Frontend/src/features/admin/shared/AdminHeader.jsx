import React from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { Shield, ExternalLink, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminHeader = ({ title = "Management Console" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-14 bg-white border-b border-zinc-200 px-6 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xs font-semibold text-black uppercase tracking-wider">
          {title}
        </h1>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
          Console Active
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
          <Shield size={13} className="text-zinc-600 stroke-1.5" />
          <span>{user?.email || 'admin@urbancleaver.com'}</span>
        </div>

        <div className="h-3.5 w-px bg-zinc-200 hidden sm:block"></div>

        <Link
          to="/"
          className="text-xs text-zinc-500 hover:text-black transition hidden md:inline-flex items-center gap-1"
        >
          <ExternalLink size={12} className="stroke-1.5" /> Store
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-zinc-600 hover:text-black border border-zinc-200 hover:border-zinc-300 rounded-md px-2.5 py-1 transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
