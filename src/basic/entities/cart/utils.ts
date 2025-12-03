/**
 * Cart Entity - 계산 로직
 * 
 * 장바구니 관련 순수 함수 (비즈니스 로직)
 */

import { CartItem } from './model';
import { Coupon } from '../coupon/model';

/**
 * 아이템에 적용 가능한 최대 할인율 계산
 * - 수량 기반 할인
 * - 대량 구매 시 추가 5% 할인 (10개 이상 구매 시)
 */
export const getMaxApplicableDiscount = (
  item: CartItem, 
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;
  
  // 수량 기반 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount 
      ? discount.rate 
      : maxDiscount;
  }, 0);
  
  // 대량 구매 보너스 (장바구니에 10개 이상 구매 항목이 있으면 추가 5%)
  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 제한
  }
  
  return baseDiscount;
};

/**
 * 개별 아이템의 총 가격 계산 (할인 적용 후)
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  
  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체 금액 계산
 * - 할인 전 총액
 * - 할인 후 총액 (쿠폰 적용 포함)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100));
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount)
  };
};

/**
 * 장바구니 아이템 수량 업데이트
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }

  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );
};

/**
 * 장바구니에 상품 추가
 */
export const addProductToCart = (
  cart: CartItem[],
  product: CartItem['product']
): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  return [...cart, { product, quantity: 1 }];
};

/**
 * 장바구니에서 상품 제거
 */
export const removeProductFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

/**
 * 장바구니의 총 아이템 개수 계산
 */
export const getTotalCartQuantity = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};
