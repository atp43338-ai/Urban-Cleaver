const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../../../shared/middleware/auth.middleware');

const router = express.Router();

/**
 * Customer / User Authentication Routes (/api/auth)
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/verify-otp', (req, res, next) => authController.verifyOtp(req, res, next));
router.post('/resend-otp', (req, res, next) => authController.resendOtp(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/google', (req, res, next) => authController.googleLogin(req, res, next));
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));
router.get('/me', protect, (req, res, next) => authController.getMe(req, res, next));

module.exports = router;
