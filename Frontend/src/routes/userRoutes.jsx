import React from 'react';
import { Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import AuthLayout from '../layouts/AuthLayout';
import Home from '../features/home/pages/Home';
import ProductListing from '../features/product/pages/ProductListing';
import ProductDetailsPage from '../features/product/pages/ProductDetailsPage';
import Cart from '../features/cart/Cart';
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
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<ProductListing />} />
    <Route path="/product/:id" element={<ProductDetailsPage />} />
    <Route path="/cart" element={<Cart />} />
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
