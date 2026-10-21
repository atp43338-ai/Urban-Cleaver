import api from '../../../../services/api';

const cutService = {
  /**
   * Fetch all cuts with optional search & status filter
   */
  async getCuts(params = {}) {
    const response = await api.get('/admin/cuts', { params });
    return response.data;
  },

  /**
   * Fetch single cut by ID
   */
  async getCutById(id) {
    const response = await api.get(`/admin/cuts/${id}`);
    return response.data;
  },

  /**
   * Create a new cut
   */
  async createCut(data) {
    const response = await api.post('/admin/cuts', data);
    return response.data;
  },

  /**
   * Update cut by ID
   */
  async updateCut(id, data) {
    const response = await api.put(`/admin/cuts/${id}`, data);
    return response.data;
  },

  /**
   * Delete cut by ID
   */
  async deleteCut(id) {
    const response = await api.delete(`/admin/cuts/${id}`);
    return response.data;
  },
};

export default cutService;
