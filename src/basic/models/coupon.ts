import { Coupon, CouponValidation } from '@/basic/types';

export const findCouponByCode = (coupons: Coupon[], code: string) => {
  return coupons.find((coupon) => coupon.code === code);
};

export const validateAddCoupon = (
  coupons: Coupon[],
  newCoupon: Coupon
): CouponValidation => {
  const existingCoupon = findCouponByCode(coupons, newCoupon.code);
  if (existingCoupon) return { valid: false, error: 'DUPLICATED' };
  return { valid: true, error: null };
};

export const validateRemoveCoupon = (
  coupons: Coupon[],
  removeCouponCode: string
): CouponValidation => {
  if (!findCouponByCode(coupons, removeCouponCode))
    return { valid: false, error: 'NOT_FOUND' };
  return { valid: true, error: null };
};
