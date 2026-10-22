const express = require('express');
const cartController = require('../controllers/cartController');
const { resolveCartUser } = require('../middleware/cartAuth.middleware');

const router = express.Router();

// Attach user / guest identity resolver to all cart endpoints
router.use(resolveCartUser);

// Cart operations
router.get('/', (req, res, next) => cartController.getCart(req, res, next));
router.post('/add', (req, res, next) => cartController.addToCart(req, res, next));
router.put('/update', (req, res, next) => cartController.updateQuantity(req, res, next));
router.delete('/item/:itemId', (req, res, next) => cartController.removeFromCart(req, res, next));
router.delete('/clear', (req, res, next) => cartController.clearCart(req, res, next));

module.exports = router;
