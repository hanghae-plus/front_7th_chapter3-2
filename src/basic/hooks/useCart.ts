import { useCallback } from 'react';
import type { CartItem, Coupon, Product } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import {
  calculateCartTotal,
  calculateItemTotal,
  updateCartItemQuantity,
  getRemainingStock as calcRemainingStock,
  addItemToCart,
  removeItemFromCart,
  type CartTotal
} from '../models';

/**
 * useCart 훅 반환 타입
 */
export interface UseCartReturn {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => CartTotal;
  getRemainingStock: (product: Product) => number;
  getItemTotal: (item: CartItem) => number;
}

/**
 * 장바구니 관리 훅
 *
 * @param selectedCoupon - 선택된 쿠폰
 * @returns 장바구니 상태와 액션들
 */
export const useCart = (selectedCoupon: Coupon | null): UseCartReturn => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = useCallback(
    (product: Product) => {
      setCart(prevCart => {
        const remainingStock = calcRemainingStock(product, prevCart);
        if (remainingStock <= 0) {
          return prevCart;
        }
        return addItemToCart(prevCart, product);
      });
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(prevCart => removeItemFromCart(prevCart, productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const getCartTotal = useCallback((): CartTotal => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      return calcRemainingStock(product, cart);
    },
    [cart]
  );

  const getItemTotal = useCallback(
    (item: CartItem): number => {
      return calculateItemTotal(item, cart);
    },
    [cart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getRemainingStock,
    getItemTotal
  };
};
