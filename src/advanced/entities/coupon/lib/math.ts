import { Coupon } from '../model/types';

/**
 * 할인 금액 계산 (순수 수학)
 * - 총액과 쿠폰을 주면 "얼마가 할인되는지" 금액만 리턴
 */
export const calculateDiscountAmount = (
  coupon: Coupon,
  totalAmount: number,
): number => {
  if (coupon.discountType === 'amount') {
    // 금액 할인 (단, 전체 금액보다 클 수는 없음)
    return Math.min(totalAmount, coupon.discountValue);
  } else {
    // 비율 할인 (10% -> 0.1 곱하기 등)
    // 데이터가 10(%) 단위라면 /100 처리 필요
    return totalAmount * (coupon.discountValue / 100);
  }
};
