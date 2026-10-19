import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import getUserRoutes from './userRoutes';
import getAdminRoutes from './adminRoutes';

/**
 * AppRoutes Orchestrator
 * Mounts Customer Routes (with UserLayout) and Admin Routes (with AdminLayout)
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes (UserLayout: Navbar + Outlet + Footer) */}
      {getUserRoutes()}

      {/* Admin Routes (AdminLayout: AdminSidebar + Header + ProtectedRoute + Outlet) */}
      {getAdminRoutes()}

      {/* Catch-all Not Found Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
