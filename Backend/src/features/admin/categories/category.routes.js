const express = require('express');
const categoryController = require('./category.controller');
const upload = require('../../../middlewares/upload.middleware');

const router = express.Router();

/**
 * ===================================================
 * Category Management Routes (/api/admin/categories)
 * Protected by protect + requireAdmin in admin.routes.js
 * ===================================================
 */
router.post('/', upload.single('image'), (req, res, next) => categoryController.createCategory(req, res, next));
router.get('/', (req, res, next) => categoryController.getAllCategories(req, res, next));
router.get('/:id', (req, res, next) => categoryController.getCategoryById(req, res, next));
router.put('/:id', upload.single('image'), (req, res, next) => categoryController.updateCategory(req, res, next));
router.delete('/:id', (req, res, next) => categoryController.deleteCategory(req, res, next));

module.exports = router;
