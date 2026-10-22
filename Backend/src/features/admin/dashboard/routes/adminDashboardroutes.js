const express = require('express');
const adminDashboardController = require('../controllers/adminDashboardcontroller');
const { requireAdmin } = require('../../auth/middleware/adminAuthmiddleware');

const router = express.Router();

/**
 * Admin Dashboard Stats Routes (/api/admin/dashboard)
 * Protected by requireAdmin
 */
router.use(requireAdmin);

router.get('/stats', (req, res, next) =>
  adminDashboardController.getStats(req, res, next)
);

module.exports = router;
