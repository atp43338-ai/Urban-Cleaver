import React from 'react';
import { Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../features/catalog/pages/HomePage';
import ProductDetailsPage from '../features/catalog/pages/ProductDetailsPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import LoginPage from '../features/auth/pages/LoginPage';
import OtpVerifyPage from '../features/auth/pages/OtpVerifyPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';

/**
 * Customer / User-Facing Routes:
 * - Public Store Pages: Wrapped in UserLayout (Navbar + Outlet + Footer)
 * - Customer Auth Pages: Wrapped in AuthLayout (Clean Brand Mark + Outlet; Strictly NO Navbar, NO Footer)
 */
export const getUserRoutes = () => [
  // 1. Storefront Routes (Navbar + Outlet + Footer)
  <Route key="customer-store" element={<UserLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/product/:id" element={<ProductDetailsPage />} />
  </Route>,

  // 2. Customer Authentication Routes (Dedicated AuthLayout)
  <Route key="customer-auth" element={<AuthLayout />}>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/verify-otp" element={<OtpVerifyPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ForgotPasswordPage />} />
  </Route>,
];

export default getUserRoutes;
