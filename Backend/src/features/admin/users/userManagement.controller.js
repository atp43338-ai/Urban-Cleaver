const userManagementService = require('./userManagement.service');

class UserManagementController {
  /**
   * GET /api/admin/users
   */
  async getUsers(req, res, next) {
    try {
      const result = await userManagementService.getAllUsers(req.query);
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
   * PATCH /api/admin/users/:id/status
   */
  async toggleStatus(req, res, next) {
    try {
      const updatedUser = await userManagementService.toggleUserStatus(
        req.params.id,
        req.user.id
      );

      const statusLabel = updatedUser.isBlocked ? 'suspended' : 'activated';
      return res.status(200).json({
        success: true,
        message: `Account for ${updatedUser.name} has been ${statusLabel}.`,
        user: updatedUser,
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
      const user = await userManagementService.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserManagementController();
