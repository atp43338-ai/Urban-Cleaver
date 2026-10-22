import api from '@/services/api';

/**
 * Cart API Service
 * Interacts with backend /api/cart endpoints
 */
const cartService = {
  /**
   * Fetch current user/guest cart
   */
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data || { success: true, cart: { items: [], subtotal: 0, discount: 0, delivery: 0, total: 0 } };
    } catch (err) {
      console.warn('[cartService.getCart] Falling back to empty cart state:', err?.message || err);
      return {
        success: false,
        cart: {
          items: [],
          subtotal: 0,
          discount: 0,
          delivery: 0,
          total: 0,
          totalItems: 0,
        },
      };
    }
  },

  /**
   * Add product variant to cart
   */
  async addToCart({ productId, cutStyle = 'Standard Cut', quantity = 1 }) {
    const response = await api.post('/cart/add', {
      productId,
      cutStyle,
      quantity,
    });
    return response.data;
  },

  /**
   * Update quantity of an existing cart item
   */
  async updateQuantity({ itemId, quantity }) {
    const response = await api.put('/cart/update', {
      itemId,
      quantity,
    });
    return response.data;
  },

  /**
   * Remove item from cart by itemId
   */
  async removeItem(itemId) {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  /**
   * Clear all items from cart
   */
  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

export default cartService;
