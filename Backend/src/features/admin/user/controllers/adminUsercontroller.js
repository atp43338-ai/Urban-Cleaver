const adminUserService = require('../services/adminUserservices');

class AdminUserController {
  /**
   * GET /api/admin/users
   */
  async getUsers(req, res, next) {
    try {
      const result = await adminUserService.getAllUsers(req.query);
      return res.status(200).json({
        success: true,
        count: result.users.length,
        pagination: result.pagination,
        users: result.users,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await adminUserService.getUserById(id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/admin/users/:id/status
   */
  async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { isBlocked, reason } = req.body;
      const result = await adminUserService.toggleUserStatus(id, { isBlocked, reason });
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminUserController();
