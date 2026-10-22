const express = require('express');
const categoryController = require('../controllers/categoryController');
const { categoryUpload } = require('../middleware/upload');
const { protect } = require('../../../shared/middleware/auth.middleware');
const { requireAdmin } = require('../../../shared/middleware/admin.middleware');

const router = express.Router();

/**
 * Category Routes (/api/categories & /api/public/categories & /api/admin/categories)
 */

// Public / Customer Catalog Endpoints
router.get('/', (req, res, next) => categoryController.getAllCategories(req, res, next));
router.get('/public', (req, res, next) => categoryController.getAllCategories(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getCategoryById(req, res, next));

// Management Operations (Protected by Admin Auth)
router.post('/', protect, requireAdmin, categoryUpload, (req, res, next) =>
  categoryController.createCategory(req, res, next)
);
router.put('/:id', protect, requireAdmin, categoryUpload, (req, res, next) =>
  categoryController.updateCategory(req, res, next)
);
router.delete('/:id', protect, requireAdmin, (req, res, next) =>
  categoryController.deleteCategory(req, res, next)
);

module.exports = router;
