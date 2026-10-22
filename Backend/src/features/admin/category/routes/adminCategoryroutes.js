const express = require('express');
const adminCategoryController = require('../controllers/adminCategorycontroller');
const { categoryUpload } = require('../middleware/adminCategorymiddleware');
const { requireAdmin } = require('../../auth/middleware/adminAuthmiddleware');

const router = express.Router();

/**
 * Admin Category Management Routes (/api/admin/categories)
 * Protected by requireAdmin
 */
router.use(requireAdmin);

router.post('/', categoryUpload, (req, res, next) =>
  adminCategoryController.createCategory(req, res, next)
);
router.get('/', (req, res, next) =>
  adminCategoryController.getAllCategories(req, res, next)
);
router.get('/:id', (req, res, next) =>
  adminCategoryController.getCategoryById(req, res, next)
);
router.put('/:id', categoryUpload, (req, res, next) =>
  adminCategoryController.updateCategory(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  adminCategoryController.deleteCategory(req, res, next)
);

module.exports = router;
