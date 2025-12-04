// TODO: 장바구니 관리 Hook

// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock

import { useState, useCallback } from 'react';
import { CartItem, Coupon, NotificationFunction, Product } from '../../types';
import { cartModel } from '../models/cart';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCart(addNotification: NotificationFunction) {
  // 1. 장바구니 상태 관리 (localStorage 연동)
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 2. 상품 추가/삭제/수량 변경
  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = cartModel.getRemainingStock(cart, product);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              'error'
            );
            return prevCart;
          }

          return cartModel.updateCartItemQuantity(
            prevCart,
            product,
            newQuantity
          );
        }

        return cartModel.addItemToCart(prevCart, product);
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (product: Product, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(product.id);
        return;
      }

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        cartModel.updateCartItemQuantity(prevCart, product, newQuantity)
      );
    },
    [removeFromCart, addNotification]
  );

  // 3. 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const totals = cartModel.calculateCartTotal(cart, selectedCoupon);
      const currentTotal = totals.totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error'
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [cart, selectedCoupon, addNotification]
  );

  // 4. 총액 계산
  const calculateTotal = useCallback(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  // 5. 재고 확인
  const getRemainingStock = useCallback(
    (product: Product) => {
      return cartModel.getRemainingStock(cart, product);
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
    clearCoupon,
  };
}
