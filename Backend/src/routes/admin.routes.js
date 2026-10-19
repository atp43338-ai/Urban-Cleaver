const express = require('express');
const adminFeatureRoutes = require('../features/admin/admin.routes');

const router = express.Router();

/**
 * ===================================================
 * Admin Routes Aggregator (/api/admin)
 * Mounts all Admin Sub-Features (auth, dashboard, users)
 * ===================================================
 */
router.use('/', adminFeatureRoutes);

module.exports = router;
