const express = require('express');
const adminAuthController = require('../controllers/adminAuthcontroller');

const router = express.Router();

/**
 * Admin Authentication Routes (/api/admin/auth)
 */
router.post('/login', (req, res, next) => adminAuthController.login(req, res, next));

module.exports = router;
