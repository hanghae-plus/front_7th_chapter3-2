// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수
import { CartItem, CartValidation, Coupon, Product } from '@/basic/types';
import {
  addItemToCart,
  calculateCartTotal,
  findProductFromCartById,
  getRemainingStock,
  removeItemFromCart,
  updateCartItemQuantity,
  validateAddCart,
  validateApplyCoupon,
  validateRemoveCart,
} from '@/models/cart';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';
import { useCallback, useState } from 'react';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: Product): CartValidation => {
      const result = validateAddCart(cart, product);
      if (!result.valid) return result;

      setCart((prevCart) => {
        const existingItem = findProductFromCartById(cart, product.id);
        if (existingItem) {
          return updateCartItemQuantity(
            prevCart,
            product.id,
            existingItem.quantity + 1
          );
        }
        return addItemToCart(prevCart, product);
      });
      return result;
    },
    [cart, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string): CartValidation => {
      const result = validateRemoveCart(cart, productId);
      if (result.valid)
        setCart((prevCart) => removeItemFromCart(prevCart, productId));
      return result;
    },
    [cart, setCart]
  );

  const updateQuantity = useCallback(
    (product: Product, newQuantity: number): CartValidation => {
      if (newQuantity <= 0) {
        return removeFromCart(product.id);
      }
      return addToCart(product);
    },
    [addToCart, removeFromCart]
  );

  const calculateTotal = useCallback(
    (cart: CartItem[], selectedCoupon?: Coupon) => {
      return calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
    },
    []
  );

  const applyCoupon = useCallback(
    (coupon: Coupon): CartValidation => {
      const result = validateApplyCoupon(cart, coupon);
      if (result.valid) setSelectedCoupon(coupon);
      return result;
    },
    [cart]
  );

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
    calculateTotal,
    getRemainingStock,
    clearCart,
  };
}
