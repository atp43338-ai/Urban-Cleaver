import api from '../../../services/api';

const catalogService = {
  /**
   * Fetch active categories for storefront filters
   */
  async getCategories(params = {}) {
    const response = await api.get('/public/categories', { params });
    return response.data;
  },

  /**
   * Fetch customer products with optional category, recipe/cutType, and search filters
   */
  async getProducts(params = {}) {
    const response = await api.get('/public/products', { params });
    return response.data;
  },

  /**
   * Fetch single product detail
   */
  async getProductById(id) {
    const response = await api.get(`/public/products/${id}`);
    return response.data;
  },
};

export default catalogService;
