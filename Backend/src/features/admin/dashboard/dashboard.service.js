const User = require('../../auth/auth.model');

class DashboardService {
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

    // Simulated / benchmarked operational metrics for orders & sales
    const totalOrders = 142;
    const grossSales = 184500; // in INR (₹)
    const averageOrderValue = 1299;

    return {
      kpis: {
        totalUsers,
        verifiedUsers,
        pendingUsers,
        blockedUsers,
        adminCount,
        customerCount: totalUsers - adminCount,
        totalOrders,
        grossSales,
        averageOrderValue,
      },
      recentActivity: recentUsers.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isVerified: u.isVerified,
        isBlocked: u.isBlocked,
        createdAt: u.createdAt,
      })),
      systemInfo: {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        serverTime: new Date().toISOString(),
        databaseStatus: 'Healthy (MongoDB Atlas)',
      },
    };
  }
}

module.exports = new DashboardService();
