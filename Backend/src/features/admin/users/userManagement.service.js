const User = require('../../auth/auth.model');

class UserManagementService {
  /**
   * Fetch registered users with regex search, status/role filters, and pagination
   */
  async getAllUsers(query = {}) {
    const filter = {};

    // 1. Search Query (Name, Email, or Phone)
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
      ];
    }

    // 2. Role Filter
    if (query.role && ['user', 'admin'].includes(query.role)) {
      filter.role = query.role;
    }

    // 3. Status Filter (active, unverified, blocked)
    if (query.status === 'blocked') {
      filter.isBlocked = true;
    } else if (query.status === 'active') {
      filter.isBlocked = false;
      filter.isVerified = true;
    } else if (query.status === 'unverified') {
      filter.isVerified = false;
    }

    // 4. Pagination
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [totalUsers, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-password -otp -otpExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalUsers / limit) || 1;

    return {
      users,
      pagination: {
        totalUsers,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Toggle user active/blocked status
   */
  async toggleUserStatus(targetUserId, requestingAdminId) {
    if (targetUserId.toString() === requestingAdminId.toString()) {
      const error = new Error('Administrators cannot suspend their own account.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(targetUserId).select('-password -otp -otpExpires');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return user;
  }

  /**
   * Get specific user profile
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -otp -otpExpires');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new UserManagementService();
