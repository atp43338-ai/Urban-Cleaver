const authService = require('./auth.service');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;
      const result = await authService.register({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Please verify the 6-digit OTP sent to your email.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/verify-otp
   */
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOtp({ email, otp });

      return res.status(200).json({
        success: true,
        message: 'Account verified successfully! Welcome to Urban Cleaver.',
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/resend-otp
   */
  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.resendOtp({ email });

      return res.status(200).json({
        success: true,
        message: 'A new 6-digit verification code has been sent to your email.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      // Support identifier (email or phone) or individual email/phone fields
      const { identifier, email, phone, password } = req.body;
      const loginId = identifier || email || phone;

      const result = await authService.login({
        identifier: loginId,
        password,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful! Welcome back.',
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      // If user is unverified, pass unverified payload
      if (err.code === 'UNVERIFIED') {
        return res.status(403).json({
          success: false,
          isVerified: false,
          email: err.email,
          message: err.message,
        });
      }
      next(err);
    }
  }

  /**
   * POST /api/auth/google
   */
  async googleLogin(req, res, next) {
    try {
      const { credential, token } = req.body;
      const result = await authService.googleLogin({ credential, token });

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully with Google!',
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword({ email });

      return res.status(200).json({
        success: true,
        message: 'A password reset OTP has been sent to your registered email address.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;
      const result = await authService.resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
