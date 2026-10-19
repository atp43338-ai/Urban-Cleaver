import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLoginPage from '../features/admin/auth/pages/AdminLoginPage';
import AdminDashboardPage from '../features/admin/dashboard/pages/AdminDashboardPage';
import AdminUsersPage from '../features/admin/users/pages/AdminUsersPage';
import AdminCategoriesPage from '../features/admin/categories/pages/AdminCategoriesPage';
import AdminProductsPage from '../features/admin/products/pages/AdminProductsPage';
import PantryManagementPage from '../features/admin/pages/PantryManagementPage';

/**
 * Admin-Facing Routes
 * - /admin/login is wrapped in AuthLayout (clean brand header, zero footer, isolated light container)
 * - /admin/dashboard, /admin/users, /admin/categories, /admin/products, /admin/pantry nested inside AdminLayout (strictly NO FOOTER)
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
    <Route path="categories" element={<AdminCategoriesPage />} />
    <Route path="products" element={<AdminProductsPage />} />
    <Route path="pantry" element={<PantryManagementPage />} />
  </Route>,
];

export default getAdminRoutes;
