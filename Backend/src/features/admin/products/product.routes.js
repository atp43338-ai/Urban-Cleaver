const express = require('express');
const productController = require('./product.controller');
const upload = require('../../../middlewares/upload.middleware');

const router = express.Router();

const productUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'image', maxCount: 1 },
]);

/**
 * ===================================================
 * Product Management Routes (/api/admin/products)
 * Protected by protect + requireAdmin in admin.routes.js
 * ===================================================
 */
router.post('/', productUpload, (req, res, next) => productController.createProduct(req, res, next));
router.get('/', (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));
router.put('/:id', productUpload, (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));

module.exports = router;
