const express = require('express');
const dashboardController = require('./dashboard.controller');

const router = express.Router();

// Dashboard Metrics Route
router.get('/stats', (req, res, next) => dashboardController.getStats(req, res, next));

module.exports = router;
