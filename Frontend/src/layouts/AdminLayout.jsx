import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import AdminSidebar from '../features/admin/shared/AdminSidebar';
import AdminHeader from '../features/admin/shared/AdminHeader';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="w-9 h-9 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Verifying Administrative Privileges...</p>
      </div>
    );
  }

  // Not logged in -> redirect to dedicated admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not an admin -> reject and redirect to admin login
  if (user?.role !== 'admin') {
    toast.error('Access Denied: Administrative credentials required.');
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 antialiased font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
