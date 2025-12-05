import type { Coupon } from '../../types';

/**
 * 쿠폰 할인을 적용한 금액을 계산합니다.
 *
 * @param amount - 원래 금액
 * @param coupon - 적용할 쿠폰
 * @returns 쿠폰 할인이 적용된 금액
 */
export const applyCouponDiscount = (
  amount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return amount;

  if (coupon.discountType === 'amount') {
    return Math.max(0, amount - coupon.discountValue);
  }

  return Math.round(amount * (1 - coupon.discountValue / 100));
};

/**
 * 쿠폰의 할인 금액을 계산합니다.
 *
 * @param amount - 원래 금액
 * @param coupon - 적용할 쿠폰
 * @returns 쿠폰으로 인한 할인 금액
 */
export const getCouponDiscountAmount = (
  amount: number,
  coupon: Coupon | null
): number => {
  if (!coupon) return 0;

  const discountedAmount = applyCouponDiscount(amount, coupon);
  return amount - discountedAmount;
};

/**
 * 쿠폰 코드가 유효한지 검증합니다.
 *
 * @param code - 쿠폰 코드
 * @param coupons - 전체 쿠폰 목록
 * @returns 유효한 쿠폰이면 해당 쿠폰, 아니면 null
 */
export const findCouponByCode = (
  code: string,
  coupons: Coupon[]
): Coupon | null => {
  return coupons.find(c => c.code === code) || null;
};

/**
 * 쿠폰 할인 정보를 포맷팅합니다.
 *
 * @param coupon - 쿠폰
 * @returns 포맷팅된 할인 정보 문자열
 */
export const formatCouponDiscount = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};
