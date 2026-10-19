import api from '../../../../services/api';

const categoryService = {
  /**
   * Fetch all categories with optional search & status filter
   */
  async getCategories(params = {}) {
    const response = await api.get('/admin/categories', { params });
    return response.data;
  },

  /**
   * Fetch single category by ID
   */
  async getCategoryById(id) {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   */
  async createCategory(data) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/admin/categories', data, config);
    return response.data;
  },

  /**
   * Update category by ID
   */
  async updateCategory(id, data) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/admin/categories/${id}`, data, config);
    return response.data;
  },

  /**
   * Delete category by ID
   */
  async deleteCategory(id) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
