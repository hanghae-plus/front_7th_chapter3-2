import { calculateDiscountAmount } from '../../coupon/lib';
import { Coupon } from '../../coupon/model/types';
import { CartItem } from '../model/types';
import { getItemTotal } from './item';

/**
 * 장바구니 전체 금액 계산
 * - 할인 전 금액
 * - 할인 후 금액 (쿠폰 적용 포함)
 */
export const getCartSummary = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  // 1. 전체 합산 (reduce 사용)
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  // 2. 개별 아이템 할인 적용된 합산
  let totalAfterDiscount = cart.reduce((total, item) => {
    return total + getItemTotal(item, cart);
  }, 0);

  // 3. 쿠폰 적용 (아까 만든 순수함수 활용) ✨
  if (selectedCoupon) {
    const couponDiscount = calculateDiscountAmount(
      selectedCoupon,
      totalAfterDiscount,
    );
    totalAfterDiscount -= couponDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};
