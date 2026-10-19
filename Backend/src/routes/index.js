const express = require('express');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

/**
 * Root API Router
 * Aggregates all Customer (User) and Admin route slices
 */

// Health & Info Endpoint: GET /api
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'Urban Cleaver API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
    },
  });
});

// Mount Customer Routes (e.g., /api/auth/register, /api/auth/login)
router.use('/', userRoutes);

// Mount Admin Routes (e.g., /api/admin/dashboard, /api/admin/users)
router.use('/admin', adminRoutes);

module.exports = router;
