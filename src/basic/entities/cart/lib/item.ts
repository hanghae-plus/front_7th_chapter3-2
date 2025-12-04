import { CART_CONFIG } from '../config';
import { CartItem } from '../model/types';

/**
 * 아이템별 할인율 계산
 */
export const getItemDiscountRate = (
  item: CartItem,
  cart: CartItem[],
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  // 1. 상품 자체의 수량별 할인율 찾기
  const baseDiscount = discounts.reduce((max, discount) => {
    return quantity >= discount.quantity && discount.rate > max
      ? discount.rate
      : max;
  }, 0);

  // 2. 장바구니 전체에서 "10개 이상" 담은 아이템이 하나라도 있는지 확인
  const hasBulkPurchase = cart.some(
    (item) => item.quantity >= CART_CONFIG.BULK_QUANTITY_THRESHOLD,
  );

  // 3. 대량 구매(10개 이상)가 있다면 5% 추가 할인 적용
  if (hasBulkPurchase) {
    return Math.min(
      baseDiscount + CART_CONFIG.BULK_DISCOUNT_RATE,
      CART_CONFIG.MAX_DISCOUNT_RATE,
    ); // 최대 50% 제한
  }

  return baseDiscount;
};

/**
 * 아이템별 총액 계산
 */
export const getItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const discountRate = getItemDiscountRate(item, cart);
  return Math.round(item.product.price * item.quantity * (1 - discountRate));
};
