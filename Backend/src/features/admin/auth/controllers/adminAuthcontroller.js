const adminAuthService = require('../services/adminAuthservices');

class AdminAuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login(req, res, next) {
    try {
      const { identifier, email, phone, password } = req.body;
      const result = await adminAuthService.login({
        identifier,
        email,
        phone,
        password,
      });

      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminAuthController();
