const express = require('express');
const adminAuthController = require('./adminAuth.controller');

const router = express.Router();

// Admin Authentication Route
router.post('/login', (req, res, next) => adminAuthController.login(req, res, next));

module.exports = router;
