import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    delivery: 0,
    total: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch cart data from backend
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res?.success && res.cart) {
        setCart(res.cart);
      } else {
        setCart({
          items: [],
          subtotal: 0,
          discount: 0,
          delivery: 0,
          total: 0,
          totalItems: 0,
        });
      }
    } catch (err) {
      console.warn('[CartContext] Failed to load cart, resetting to empty state:', err?.message || err);
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        delivery: 0,
        total: 0,
        totalItems: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Derived cart items
  const cartItems = useMemo(() => cart.items || [], [cart.items]);

  // Derived total unit count across all items in cart
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  }, [cartItems]);

  // Derived financial summary
  const cartSummary = useMemo(() => {
    return {
      subtotal: cart.subtotal || 0,
      discount: cart.discount || 0,
      delivery: cart.delivery || 0,
      total: cart.total || 0,
      totalItems: cartCount,
      deliveryThreshold: cart.deliveryThreshold || 500,
      isFreeDelivery: Boolean(cart.isFreeDelivery),
    };
  }, [cart, cartCount]);

  /**
   * Add product to cart with chosen cut style & quantity
   */
  const addToCart = useCallback(
    async ({ product, productId, cutStyle = 'Standard Cut', quantity = 1, showToast = true }) => {
      const targetId = productId || product?._id || product?.id;
      if (!targetId) {
        toast.error('Unable to add item: missing product identifier');
        return false;
      }

      try {
        setIsUpdating(true);
        const res = await cartService.addToCart({
          productId: targetId,
          cutStyle,
          quantity,
        });

        if (res?.success && res.cart) {
          setCart(res.cart);
          if (showToast) {
            const productName = product?.name || 'Item';
            toast.success(`Added ${productName} (${cutStyle}) to cart!`, {
              icon: '🛒',
            });
          }
          return true;
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to add item to cart';
        toast.error(msg);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  /**
   * Update quantity of a cart item
   */
  const updateQty = useCallback(async (itemId, quantity) => {
    if (!itemId) return;

    try {
      setIsUpdating(true);
      const res = await cartService.updateQuantity({
        itemId,
        quantity,
      });

      if (res?.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback(async (itemId, itemName) => {
    if (!itemId) return;

    try {
      setIsUpdating(true);
      const res = await cartService.removeItem(itemId);
      if (res?.success && res.cart) {
        setCart(res.cart);
        toast.success(itemName ? `Removed ${itemName} from cart` : 'Item removed from cart');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Clear all items in cart
   */
  const clearCart = useCallback(async () => {
    try {
      setIsUpdating(true);
      const res = await cartService.clearCart();
      if (res?.success && res.cart) {
        setCart(res.cart);
        toast.success('Cart cleared');
      }
    } catch (err) {
      toast.error('Failed to clear cart');
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const value = {
    cart,
    cartItems,
    cartCount,
    cartSummary,
    loading,
    isUpdating,
    fetchCart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
