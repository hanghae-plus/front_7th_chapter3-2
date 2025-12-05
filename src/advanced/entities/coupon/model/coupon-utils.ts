import { Coupon } from '../../../../types';

/** 쿠폰 이름이 유효한지 검증 */
export const isValidCouponName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length > 0;
};

/** 쿠폰 할인 값이 유효한지 검증 */
export const isValidDiscountValue = (
  discountType: 'amount' | 'percentage',
  discountValue: number
): boolean => {
  if (typeof discountValue !== 'number' || isNaN(discountValue)) {
    return false;
  }

  if (discountType === 'amount') {
    return discountValue > 0;
  }

  if (discountType === 'percentage') {
    return discountValue > 0 && discountValue <= 100;
  }

  return false;
};

/** 쿠폰 전체 검증 */
export const isValidCoupon = (coupon: Partial<Coupon>): boolean => {
  return !!(
    coupon.name &&
    isValidCouponName(coupon.name) &&
    coupon.code &&
    coupon.discountType &&
    coupon.discountValue !== undefined &&
    isValidDiscountValue(coupon.discountType, coupon.discountValue)
  );
};

/** 쿠폰 목록에서 특정 코드의 쿠폰 찾기 */
export const findCouponByCode = (
  coupons: Coupon[],
  code: string
): Coupon | undefined => {
  return coupons.find((c) => c.code === code);
};

/** 쿠폰 코드 중복 여부 확인 */
export const isDuplicateCouponCode = (
  coupons: Coupon[],
  code: string
): boolean => {
  return coupons.some((c) => c.code === code);
};
