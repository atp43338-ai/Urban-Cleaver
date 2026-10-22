const User = require('../../auth/models/User');

class AdminDashboardService {
  /**
   * Fetch system overview KPIs and activity metrics
   */
  async getDashboardStats() {
    const [
      totalUsers,
      verifiedUsers,
      pendingUsers,
      blockedUsers,
      adminCount,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ role: 'admin' }),
      User.find()
        .select('name email phone role isVerified isBlocked createdAt')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    return {
      kpis: {
        totalUsers,
        verifiedUsers,
        pendingUsers,
        blockedUsers,
        adminCount,
      },
      recentUsers,
    };
  }
}

module.exports = new AdminDashboardService();
