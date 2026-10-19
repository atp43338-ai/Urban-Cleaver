import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLoginPage from '../features/admin/auth/pages/AdminLoginPage';
import AdminDashboardPage from '../features/admin/dashboard/pages/AdminDashboardPage';
import AdminUsersPage from '../features/admin/users/pages/AdminUsersPage';

/**
 * Admin-Facing Routes
 * - /admin/login is wrapped in AuthLayout (clean brand header, zero footer, isolated light container)
 * - /admin/dashboard & /admin/users nested inside AdminLayout (Sidebar + Header + Outlet; strictly NO FOOTER)
 */
export const getAdminRoutes = () => [
  // 1. Dedicated Unauthenticated Admin Portal Login (Wrapped in AuthLayout)
  <Route key="admin-auth" element={<AuthLayout />}>
    <Route path="/admin/login" element={<AdminLoginPage />} />
  </Route>,

  // 2. Protected Administrative Domain nested under AdminLayout
  <Route key="admin-portal" path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboardPage />} />
    <Route path="users" element={<AdminUsersPage />} />
  </Route>,
];

export default getAdminRoutes;
