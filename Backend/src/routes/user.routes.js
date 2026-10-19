const express = require('express');
const authRoutes = require('../features/auth/auth.routes');

const router = express.Router();

/**
 * ===================================================
 * Customer / User-Facing Routes Aggregator
 * ===================================================
 */

// Authentication & Account Verification (/api/auth)
router.use('/auth', authRoutes);

// Placeholder modules for future customer features (Products, Cart, Orders)
// router.use('/products', productRoutes);
// router.use('/cart', cartRoutes);
// router.use('/orders', orderRoutes);

module.exports = router;
