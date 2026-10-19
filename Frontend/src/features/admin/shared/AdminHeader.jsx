import React from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { Shield, Bell, CheckCircle } from 'lucide-react';

const AdminHeader = ({ title = "User Management Console" }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-800">{title}</h1>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Admin Session
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Shield size={14} className="text-orange-500" />
          <span>Role: <strong className="text-slate-700 capitalize">{user?.role || 'admin'}</strong></span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
