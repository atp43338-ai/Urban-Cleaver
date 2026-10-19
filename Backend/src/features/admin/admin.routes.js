const express = require('express');
const adminAuthRoutes = require('./auth/adminAuth.routes');
const dashboardRoutes = require('./dashboard/dashboard.routes');
const userManagementRoutes = require('./users/userManagement.routes');
const { protect } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');

const router = express.Router();

/**
 * ========================================================
 * Admin Feature Aggregator Router
 * Aggregates all Admin sub-feature slices (auth, dashboard, users)
 * ========================================================
 */

// 1. Admin Authentication Slice (/api/admin/auth)
router.use('/auth', adminAuthRoutes);

// 2. Admin Dashboard Slice (/api/admin/dashboard) - Protected
router.use('/dashboard', protect, requireAdmin, dashboardRoutes);

// 3. Admin User Management Slice (/api/admin/users) - Protected
router.use('/users', protect, requireAdmin, userManagementRoutes);

module.exports = router;
