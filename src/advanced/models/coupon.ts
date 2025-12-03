import { Coupon } from '../../types';

export const addCoupon = (newCoupon: Coupon, coupons: Coupon[]) => {
  return [...coupons, newCoupon];
};

export const removeCoupon = (couponCode: string, coupons: Coupon[]) => {
  return coupons.filter((c) => c.code !== couponCode);
};
