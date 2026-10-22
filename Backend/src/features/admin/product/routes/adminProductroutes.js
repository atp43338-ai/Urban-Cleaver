const express = require('express');
const adminProductController = require('../controllers/adminProductcontroller');
const { productUpload } = require('../middleware/adminProductmiddleware');
const { requireAdmin } = require('../../auth/middleware/adminAuthmiddleware');

const router = express.Router();

/**
 * Admin Product Management Routes (/api/admin/products)
 * Protected by requireAdmin
 */
router.use(requireAdmin);

router.post('/', productUpload, (req, res, next) =>
  adminProductController.createProduct(req, res, next)
);
router.get('/', (req, res, next) =>
  adminProductController.getAllProducts(req, res, next)
);
router.get('/:id', (req, res, next) =>
  adminProductController.getProductById(req, res, next)
);
router.put('/:id', productUpload, (req, res, next) =>
  adminProductController.updateProduct(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  adminProductController.deleteProduct(req, res, next)
);

module.exports = router;
