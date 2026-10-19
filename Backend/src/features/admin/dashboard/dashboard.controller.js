const dashboardService = require('./dashboard.service');

class DashboardController {
  /**
   * GET /api/admin/dashboard/stats
   */
  async getStats(req, res, next) {
    try {
      const data = await dashboardService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();
