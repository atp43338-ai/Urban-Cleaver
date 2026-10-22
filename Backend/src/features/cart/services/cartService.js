const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../../product/models/Product');

class CartService {
  /**
   * Helper to build user/guest query criteria
   */
  _getQueryCriteria(userId) {
    if (!userId) {
      return { guestId: 'guest_default_session' };
    }
    if (mongoose.Types.ObjectId.isValid(userId)) {
      return {
        $or: [{ user: userId }, { guestId: String(userId) }],
      };
    }
    return { guestId: String(userId) };
  }

  /**
   * Helper to format cart response with computed financial metrics
   */
  _formatCart(cart) {
    if (!cart) {
      return {
        items: [],
        subtotal: 0,
        discount: 0,
        delivery: 0,
        total: 0,
        totalItems: 0,
        deliveryThreshold: 500,
        isFreeDelivery: false,
      };
    }

    const items = (cart.items || []).filter((item) => item && item.product);

    let subtotal = 0;
    let totalItems = 0;

    const formattedItems = items.map((item) => {
      const prod = item.product;
      const unitPrice = Number(item.price ?? prod?.price ?? 0);
      const qty = Number(item.quantity || 1);
      const itemSubtotal = unitPrice * qty;

      subtotal += itemSubtotal;
      totalItems += qty;

      return {
        _id: item._id,
        id: item._id,
        product: {
          _id: prod._id,
          id: prod._id,
          name: prod.name,
          price: prod.price,
          images: prod.images || [],
          grossWeight: prod.grossWeight || '',
          netWeight: prod.netWeight || '',
          cutTypes: prod.cutTypes || [],
          isStock: prod.isStock !== false,
          category: prod.category,
        },
        cutStyle: item.cutStyle || 'Standard Cut',
        quantity: qty,
        price: unitPrice,
        itemSubtotal,
      };
    });

    const deliveryThreshold = 500;
    const standardDeliveryFee = 100;
    const discount = 0; // Configurable promotional discount

    // Delivery fee logic: ₹0 if cart is empty or reaches threshold; else standard fee
    let delivery = 0;
    if (subtotal > 0) {
      delivery = subtotal >= deliveryThreshold ? 0 : standardDeliveryFee;
    }

    const total = Math.max(0, subtotal - discount + delivery);

    return {
      _id: cart._id,
      items: formattedItems,
      subtotal,
      discount,
      delivery,
      total,
      totalItems,
      deliveryThreshold,
      isFreeDelivery: delivery === 0 && subtotal > 0,
    };
  }

  /**
   * Helper to find or create cart document
   */
  async _findOrCreateCart(userId) {
    const query = this._getQueryCriteria(userId);
    let cart = await Cart.findOne(query);

    if (!cart) {
      const cartData = { items: [] };
      if (mongoose.Types.ObjectId.isValid(userId)) {
        cartData.user = userId;
      } else {
        cartData.guestId = String(userId);
      }
      cart = await Cart.create(cartData);
    }

    return cart;
  }

  /**
   * 1. GET CART: Fetch cart with populated product data
   */
  async getCart(userId) {
    const query = this._getQueryCriteria(userId);
    let cart = await Cart.findOne(query).populate({
      path: 'items.product',
      select: 'name price images grossWeight netWeight cutTypes isStock category description',
    });

    if (!cart) {
      cart = await this._findOrCreateCart(userId);
    }

    return this._formatCart(cart);
  }

  /**
   * 2. ADD TO CART: Add product or increment existing quantity
   */
  async addToCart(userId, productId, cutStyle = 'Standard Cut', quantity = 1) {
    if (!productId) {
      const error = new Error('Product ID is required');
      error.statusCode = 400;
      throw error;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (product.isStock === false) {
      const error = new Error('Product is currently out of stock');
      error.statusCode = 400;
      throw error;
    }

    const cart = await this._findOrCreateCart(userId);

    const normalizedCut = (cutStyle || 'Standard Cut').trim();

    // Check if the exact product + cutStyle combination already exists
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product &&
        item.product.toString() === productId.toString() &&
        (item.cutStyle || 'Standard Cut').toLowerCase() === normalizedCut.toLowerCase()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        cutStyle: normalizedCut,
        quantity: qty,
        price: product.price,
      });
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price images grossWeight netWeight cutTypes isStock category description',
    });

    return this._formatCart(cart);
  }

  /**
   * 3. UPDATE QUANTITY: Update item quantity or remove if <= 0
   */
  async updateQuantity(userId, itemId, quantity) {
    if (!itemId) {
      const error = new Error('Item ID is required');
      error.statusCode = 400;
      throw error;
    }

    const newQty = parseInt(quantity, 10);
    const cart = await this._findOrCreateCart(userId);

    // If new quantity is 0 or negative, remove item
    if (newQty <= 0) {
      return this.removeFromCart(userId, itemId);
    }

    const item = cart.items.find(
      (i) =>
        i._id.toString() === itemId.toString() ||
        (i.product && i.product.toString() === itemId.toString())
    );

    if (!item) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      throw error;
    }

    item.quantity = newQty;
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price images grossWeight netWeight cutTypes isStock category description',
    });

    return this._formatCart(cart);
  }

  /**
   * 4. REMOVE FROM CART: Pull item from cart items array
   */
  async removeFromCart(userId, itemId) {
    if (!itemId) {
      const error = new Error('Item ID is required');
      error.statusCode = 400;
      throw error;
    }

    const cart = await this._findOrCreateCart(userId);

    cart.items = cart.items.filter(
      (item) =>
        item._id.toString() !== itemId.toString() &&
        (!item.product || item.product.toString() !== itemId.toString())
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price images grossWeight netWeight cutTypes isStock category description',
    });

    return this._formatCart(cart);
  }

  /**
   * 5. CLEAR CART: Remove all items
   */
  async clearCart(userId) {
    const cart = await this._findOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    return this._formatCart(cart);
  }
}

module.exports = new CartService();
