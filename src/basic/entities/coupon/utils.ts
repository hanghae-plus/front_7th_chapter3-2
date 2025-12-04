/**
 * Coupon Entity - 검증 로직
 * 
 * 쿠폰 관련 순수 함수 (비즈니스 로직)
 */

import { Coupon } from './model';

/**
 * 쿠폰 적용 가능 여부 검증
 * - percentage 쿠폰은 10,000원 이상 구매 시에만 사용 가능
 */
export const canApplyCoupon = (
  coupon: Coupon,
  totalAmount: number
): { canApply: boolean; reason?: string } => {
  if (coupon.discountType === 'percentage' && totalAmount < 10000) {
    return {
      canApply: false,
      reason: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.'
    };
  }
  
  return { canApply: true };
};

/**
 * 쿠폰 중복 여부 검증
 */
export const isDuplicateCoupon = (
  coupons: Coupon[],
  couponCode: string
): boolean => {
  return coupons.some(c => c.code === couponCode);
};
