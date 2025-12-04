import { useState, useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock
} from '../models/cart';

/**
 * 장바구니 관리 Hook
 * 장바구니 상태 관리, 쿠폰 적용, 총액 계산 등 제공
 */
export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => addItemToCart(prevCart, product));
  }, [setCart]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => removeItemFromCart(prevCart, productId));
  }, [setCart]);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
  }, [setCart]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
  }, []);

  const removeCouponSelection = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getProductRemainingStock = useCallback((product: Product) => {
    return getRemainingStock(product, cart);
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCouponSelection,
    calculateTotal,
    getRemainingStock: getProductRemainingStock,
    clearCart
  };
}
