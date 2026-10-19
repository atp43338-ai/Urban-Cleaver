import api from '../../../../services/api';

const userManagementService = {
  /**
   * Fetch users list with optional search and filter params
   * @param {Object} params - { search, role, status }
   */
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Toggle user active/blocked status
   * @param {string} userId
   */
  async toggleUserStatus(userId) {
    const response = await api.patch(`/admin/users/${userId}/status`);
    return response.data;
  },

  /**
   * Fetch specific user details
   * @param {string} userId
   */
  async getUserById(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
};

export default userManagementService;
