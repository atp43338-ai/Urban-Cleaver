const express = require('express');
const cutController = require('./cut.controller');

const router = express.Router();

/**
 * Cut Management Routes (/api/admin/cuts)
 * Protected by protect + requireAdmin in admin.routes.js
 */
router.post('/', (req, res, next) => cutController.createCut(req, res, next));
router.get('/', (req, res, next) => cutController.getAllCuts(req, res, next));
router.get('/:id', (req, res, next) => cutController.getCutById(req, res, next));
router.put('/:id', (req, res, next) => cutController.updateCut(req, res, next));
router.delete('/:id', (req, res, next) => cutController.deleteCut(req, res, next));

module.exports = router;
