const express = require('express');
const adminProductController = require('../controllers/adminProductcontroller');
const { requireAdmin } = require('../../auth/middleware/adminAuthmiddleware');

const router = express.Router();

/**
 * Admin Culinary Cut Management Routes (/api/admin/cuts)
 */
// Public or authenticated reading
router.get('/', (req, res, next) =>
  adminProductController.getAllCuts(req, res, next)
);
router.get('/:id', (req, res, next) =>
  adminProductController.getCutById(req, res, next)
);

// Admin-protected creations and modifications
router.post('/', requireAdmin, (req, res, next) =>
  adminProductController.createCut(req, res, next)
);
router.put('/:id', requireAdmin, (req, res, next) =>
  adminProductController.updateCut(req, res, next)
);
router.delete('/:id', requireAdmin, (req, res, next) =>
  adminProductController.deleteCut(req, res, next)
);

module.exports = router;
