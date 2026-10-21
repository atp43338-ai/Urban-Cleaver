import api from '../../../services/api';

/**
 * Service for fetching products, categories, and cuts from storefront API
 * Backed by /api/public/categories, /api/public/cuts, and /api/public/products
 */
const productService = {
  /**
   * Fetch active categories for storefront filters
   */
  async getCategories(params = {}) {
    const response = await api.get('/public/categories', { params });
    return response.data;
  },

  /**
   * Fetch active culinary cuts for storefront dish filters
   */
  async getCuts(params = {}) {
    const response = await api.get('/public/cuts', { params });
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
   * Fetch single product detail by ID
   */
  async getProductById(id) {
    const response = await api.get(`/public/products/${id}`);
    return response.data;
  },
};

export default productService;
