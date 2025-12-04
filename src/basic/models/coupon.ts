import { Coupon } from '../../types';

export const couponModel = {
  addCoupon: (coupons: Coupon[], coupon: Coupon) => {
    return [...coupons, coupon];
  },
  removeCoupon: (code: string, coupons: Coupon[]) => {
    return coupons.filter((coupon) => coupon.code !== code);
  },
};
