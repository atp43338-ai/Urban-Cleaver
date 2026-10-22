const adminDashboardService = require('../services/adminDashboardservices');

class AdminDashboardController {
  /**
   * GET /api/admin/dashboard/stats
   */
  async getStats(req, res, next) {
    try {
      const data = await adminDashboardService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminDashboardController();
