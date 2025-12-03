import { useCallback, useEffect, useState } from 'react';
import { CartItem, Product } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity as updateItemQuantity,
  getTotalItemCount,
} from '../models/cart';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    setTotalItemCount(getTotalItemCount(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: Product) => {
      setCart((prevCart) => addItemToCart({ cart: prevCart, product }));
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => removeItemFromCart({ cart: prevCart, productId }));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCart((prevCart) =>
        updateItemQuantity({ cart: prevCart, productId, quantity: newQuantity })
      );
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
