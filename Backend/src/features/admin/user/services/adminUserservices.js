const User = require('../models/User');

class AdminUserService {
  /**
   * Fetch registered users with regex search, status/role filters, and pagination
   */
  async getAllUsers(query = {}) {
    const filter = {};

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
      ];
    }

    if (query.role && ['user', 'admin'].includes(query.role)) {
      filter.role = query.role;
    }

    if (query.status) {
      if (query.status === 'blocked') filter.isBlocked = true;
      if (query.status === 'unverified') filter.isVerified = false;
      if (query.status === 'active') {
        filter.isBlocked = false;
        filter.isVerified = true;
      }
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -otp -otpExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -otp -otpExpires');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Toggle user active/blocked status
   */
  async toggleUserStatus(userId, { isBlocked, reason }) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'admin') {
      const error = new Error('Super-admin status cannot be modified via user controls');
      error.statusCode = 403;
      throw error;
    }

    if (typeof isBlocked === 'boolean') {
      user.isBlocked = isBlocked;
    } else {
      user.isBlocked = !user.isBlocked;
    }

    await user.save();
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
      },
      message: `User successfully ${user.isBlocked ? 'blocked' : 'unblocked'}`,
    };
  }
}

module.exports = new AdminUserService();
