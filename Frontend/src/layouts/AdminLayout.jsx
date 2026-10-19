import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import AdminSidebar from '../features/admin/shared/AdminSidebar';
import AdminHeader from '../features/admin/shared/AdminHeader';
import toast from 'react-hot-toast';

/**
 * Ultra-Clean Minimalist Monochromatic Admin Shell
 * Strictly Header + Sidebar only. Zero public footer.
 */
const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-zinc-800 gap-3">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-xs font-medium tracking-wide text-zinc-500">
          Verifying administrative credentials...
        </p>
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
    <div className="min-h-screen flex bg-white text-zinc-900 antialiased font-sans selection:bg-black selection:text-white">
      {/* Monochromatic Left Sidebar */}
      <AdminSidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-white">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
