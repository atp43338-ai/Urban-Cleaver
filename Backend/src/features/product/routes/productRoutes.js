const express = require('express');
const productController = require('../controllers/productController');
const { productUpload } = require('../middleware/upload');
const { protect } = require('../../../shared/middleware/auth.middleware');
const { requireAdmin } = require('../../../shared/middleware/admin.middleware');

const router = express.Router();

/**
 * Product Routes (/api/products & /api/public/products)
 * Unified domain router handling both storefront and management operations
 */

// Public / Customer Catalog Endpoints
router.get('/', (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/public', (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));

// Management Operations (Protected by Admin Auth)
router.post('/', protect, requireAdmin, productUpload, (req, res, next) =>
  productController.createProduct(req, res, next)
);
router.put('/:id', protect, requireAdmin, productUpload, (req, res, next) =>
  productController.updateProduct(req, res, next)
);
router.delete('/:id', protect, requireAdmin, (req, res, next) =>
  productController.deleteProduct(req, res, next)
);

module.exports = router;
