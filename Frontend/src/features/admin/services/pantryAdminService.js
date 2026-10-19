import api from '../../../services/api';

/**
 * Service for Admin Pantry & Recipe Kits Management
 * Backed by /api/admin/pantry
 */
const pantryAdminService = {
  /**
   * Fetch all pantry items with optional search, category, recipe, inStock filters & pagination
   */
  async getAllPantryItems(params = {}) {
    const response = await api.get('/admin/pantry', { params });
    return response.data;
  },

  /**
   * Fetch a single pantry item by ID
   */
  async getPantryItemById(id) {
    const response = await api.get(`/admin/pantry/${id}`);
    return response.data;
  },

  /**
   * Create a new pantry kit item (supports JSON or FormData with file)
   */
  async createPantryItem(data) {
    const response = await api.post('/admin/pantry', data);
    return response.data;
  },

  /**
   * Update an existing pantry kit item
   */
  async updatePantryItem(id, data) {
    const response = await api.put(`/admin/pantry/${id}`, data);
    return response.data;
  },

  /**
   * 1-click toggle for in-stock availability
   */
  async toggleStockStatus(id) {
    const response = await api.patch(`/admin/pantry/${id}/toggle-stock`);
    return response.data;
  },

  /**
   * Delete a pantry kit item
   */
  async deletePantryItem(id) {
    const response = await api.delete(`/admin/pantry/${id}`);
    return response.data;
  },
};

export default pantryAdminService;
