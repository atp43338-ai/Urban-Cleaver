import api from '../../../../services/api';

const dashboardService = {
  /**
   * Fetch admin KPI summary and recent activity
   */
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
};

export default dashboardService;
