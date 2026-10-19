const express = require('express');
const authRoutes = require('../features/auth/auth.routes');
const catalogRoutes = require('../features/catalog/catalog.routes');
const { publicRouter: pantryPublicRoutes } = require('../features/pantry/routes/pantry.routes');

const router = express.Router();

/**
 * ===================================================
 * Customer / User-Facing Routes Aggregator
 * ===================================================
 */

// Authentication & Account Verification (/api/auth)
router.use('/auth', authRoutes);

// Public Storefront Pantry & Recipe Kits (/api/public/pantry, /api/pantry)
router.use('/public/pantry', pantryPublicRoutes);
router.use('/pantry', pantryPublicRoutes);

// Public Storefront Catalog (/api/categories, /api/products, /api/public/categories, /api/public/products)
router.use('/public', catalogRoutes);
router.use('/', catalogRoutes);

module.exports = router;
