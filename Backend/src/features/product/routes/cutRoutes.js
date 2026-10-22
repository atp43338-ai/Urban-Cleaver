const express = require('express');
const cutController = require('../controllers/cutController');
const { protect } = require('../../../shared/middleware/auth.middleware');
const { requireAdmin } = require('../../../shared/middleware/admin.middleware');

const router = express.Router();

/**
 * Culinary Cut Routes (/api/cuts & /api/public/cuts & /api/admin/cuts)
 */

// Public / Customer Catalog Endpoints
router.get('/', (req, res, next) => cutController.getAllCuts(req, res, next));
router.get('/public', (req, res, next) => cutController.getAllCuts(req, res, next));
router.get('/:id', (req, res, next) => cutController.getCutById(req, res, next));

// Cut Creation (Supports Admin and Customer Storefront Dynamic Registration)
router.post('/', (req, res, next) => cutController.createCut(req, res, next));

// Management Operations (Protected by Admin Auth)
router.put('/:id', protect, requireAdmin, (req, res, next) =>
  cutController.updateCut(req, res, next)
);
router.delete('/:id', protect, requireAdmin, (req, res, next) =>
  cutController.deleteCut(req, res, next)
);

module.exports = router;
