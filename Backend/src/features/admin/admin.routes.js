const express = require('express');
const adminAuthRoutes = require('./auth/adminAuth.routes');
const dashboardRoutes = require('./dashboard/dashboard.routes');
const userManagementRoutes = require('./users/userManagement.routes');
const categoryRoutes = require('./categories/category.routes');
const productRoutes = require('./products/product.routes');
const { adminRouter: pantryRoutes } = require('../pantry/routes/pantry.routes');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');

const router = express.Router();

/**
 * ========================================================
 * Admin Feature Aggregator Router
 * Aggregates all Admin sub-feature slices:
 * - /auth
 * - /dashboard
 * - /users
 * - /categories
 * - /products
 * - /pantry
 * ========================================================
 */

// 1. Admin Authentication Slice (/api/admin/auth)
router.use('/auth', adminAuthRoutes);

// 2. Admin Dashboard Slice (/api/admin/dashboard) - Protected
router.use('/dashboard', protect, requireAdmin, dashboardRoutes);

// 3. Admin User Management Slice (/api/admin/users) - Protected
router.use('/users', protect, requireAdmin, userManagementRoutes);

// 4. Admin Category Management Slice (/api/admin/categories) - Protected
router.use('/categories', protect, requireAdmin, categoryRoutes);

// 5. Admin Product Management Slice (/api/admin/products) - Protected
router.use('/products', protect, requireAdmin, productRoutes);

// 6. Admin Pantry & Recipe Kits Slice (/api/admin/pantry) - Protected
router.use('/pantry', protect, requireAdmin, pantryRoutes);

module.exports = router;
