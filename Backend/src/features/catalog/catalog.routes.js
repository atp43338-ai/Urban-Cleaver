const express = require('express');
const catalogController = require('./catalog.controller');
const cutController = require('../admin/cuts/cut.controller');

const router = express.Router();

/**
 * Public Customer Storefront Routes (No Auth Required)
 */

// Categories endpoints
router.get('/categories', (req, res, next) => catalogController.getActiveCategories(req, res, next));
router.get('/categories/public', (req, res, next) => catalogController.getActiveCategories(req, res, next));

// Cuts endpoints (Storefront & fallback creation)
router.get('/cuts', (req, res, next) => cutController.getAllCuts(req, res, next));
router.get('/cuts/public', (req, res, next) => cutController.getAllCuts(req, res, next));
router.post('/cuts', (req, res, next) => cutController.createCut(req, res, next));

// Products endpoints
router.get('/products', (req, res, next) => catalogController.getPublicProducts(req, res, next));
router.get('/products/public', (req, res, next) => catalogController.getPublicProducts(req, res, next));
router.get('/products/:id', (req, res, next) => catalogController.getProductById(req, res, next));

module.exports = router;
