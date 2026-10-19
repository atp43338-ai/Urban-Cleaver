import api from '../../../../services/api';

const productService = {
  /**
   * Fetch all products with search, category, stock filter & pagination
   */
  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id) {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  async createProduct(data) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/admin/products', data, config);
    return response.data;
  },

  /**
   * Update product by ID
   */
  async updateProduct(id, data) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/admin/products/${id}`, data, config);
    return response.data;
  },

  /**
   * Delete product by ID
   */
  async deleteProduct(id) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
};

export default productService;
