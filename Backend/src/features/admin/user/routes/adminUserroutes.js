const express = require('express');
const adminUserController = require('../controllers/adminUsercontroller');
const { requireAdmin } = require('../../auth/middleware/adminAuthmiddleware');

const router = express.Router();

/**
 * Admin User Management Routes (/api/admin/users)
 * Protected by requireAdmin
 */
router.use(requireAdmin);

router.get('/', (req, res, next) =>
  adminUserController.getUsers(req, res, next)
);
router.get('/:id', (req, res, next) =>
  adminUserController.getUserById(req, res, next)
);
router.patch('/:id/status', (req, res, next) =>
  adminUserController.toggleUserStatus(req, res, next)
);

module.exports = router;
