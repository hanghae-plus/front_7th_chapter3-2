import { useCallback } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { CartItem } from './types';
import { Product } from '../../product/model/types';
import { STORAGE_KEYS } from '../../../shared/config/storageKeys';

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);

  const getItem = useCallback(
    (productId: string) => {
      return cart.find((item) => item.product.id === productId);
    },
    [cart],
  );

  const addToCart = useCallback(
    (product: Product) => {
      setCart((prevCart) => {
        const existing = prevCart.find(
          (item) => item.product.id === product.id,
        );
        if (existing) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prevCart, { product, quantity: 1 }];
      });
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId),
      );
    },
    [setCart],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    },
    [setCart, removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    getItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemCount,
  };
};
