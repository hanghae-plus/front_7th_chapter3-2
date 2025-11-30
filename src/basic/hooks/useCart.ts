import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import * as cartModel from '../models/cart';

type NotificationFn = (
  message: string,
  type: 'error' | 'success' | 'warning'
) => void;

export function useCart(addNotification?: NotificationFn) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 상품 추가
  const addToCart = (product: Product) => {
    const remainingStock = cartModel.getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      addNotification?.('재고가 부족합니다!', 'error');
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock) {
        addNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }
    }

    setCart((prevCart) => {
      if (existingItem) {
        return cartModel.updateCartItemQuantity(
          prevCart,
          product.id,
          existingItem.quantity + 1
        );
      }
      return cartModel.addItemToCart(prevCart, product);
    });

    addNotification?.('장바구니에 담았습니다', 'success');
  };

  const removeFromCart = (product: Product) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, product.id));
  };

  const updateQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product);
      return;
    }

    // 수량 업데이트 시에는 총 재고와 비교해야 함
    if (quantity > product.stock) {
      addNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
      return;
    }

    // ✅ 업데이트만 수행 (추가 로직 제거)
    setCart((prevCart) =>
      cartModel.updateCartItemQuantity(prevCart, product.id, quantity)
    );
  };

  const getRemainingStock = (product: Product) => {
    return cartModel.getRemainingStock(product, cart);
  };

  const calculateTotal = () => {
    return cartModel.calculateCartTotal(cart, selectedCoupon ?? undefined);
  };

  const applyCoupon = (coupon: Coupon) => {
    const { totalAfterDiscount } = cartModel.calculateCartTotal(cart, coupon);

    if (totalAfterDiscount < 10000 && coupon.discountType === 'percentage') {
      addNotification?.(
        'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
        'error'
      );
      return;
    }
    setSelectedCoupon(coupon);
    addNotification?.('쿠폰이 적용되었습니다.', 'success');
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCoupon(null);
  };

  const clearCoupon = () => {
    setSelectedCoupon(null);
  };

  const getItemTotal = (item: CartItem) => {
    return cartModel.calculateItemTotal(item, cart);
  };

  return {
    cart,
    addToCart,
    calculateTotal,
    applyCoupon,
    clearCart,
    clearCoupon,
    getRemainingStock,
    getItemTotal,
    removeFromCart,
    updateQuantity,
    selectedCoupon,
  };
}
