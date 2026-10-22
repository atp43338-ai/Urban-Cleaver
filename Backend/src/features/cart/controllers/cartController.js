const cartService = require('../services/cartService');

class CartController {
  /**
   * GET /api/cart
   */
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.userId);
      return res.status(200).json({
        success: true,
        cart,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/cart/add
   */
  async addToCart(req, res, next) {
    try {
      const { productId, cutStyle, quantity } = req.body;
      const cart = await cartService.addToCart(
        req.userId,
        productId,
        cutStyle,
        quantity
      );
      return res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        cart,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/cart/update
   */
  async updateQuantity(req, res, next) {
    try {
      const { itemId, quantity } = req.body;
      const cart = await cartService.updateQuantity(
        req.userId,
        itemId,
        quantity
      );
      return res.status(200).json({
        success: true,
        message: 'Cart updated successfully',
        cart,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/cart/item/:itemId
   */
  async removeFromCart(req, res, next) {
    try {
      const { itemId } = req.params;
      const cart = await cartService.removeFromCart(req.userId, itemId);
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        cart,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/cart/clear
   */
  async clearCart(req, res, next) {
    try {
      const cart = await cartService.clearCart(req.userId);
      return res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        cart,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
