const express = require('express');
const userManagementController = require('./userManagement.controller');

const router = express.Router();

// Routes inside users/ sub-feature
router.get('/', (req, res, next) => userManagementController.getUsers(req, res, next));
router.get('/:id', (req, res, next) => userManagementController.getUserById(req, res, next));
router.patch('/:id/status', (req, res, next) => userManagementController.toggleStatus(req, res, next));

module.exports = router;
