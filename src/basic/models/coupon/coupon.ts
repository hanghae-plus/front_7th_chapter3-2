import { Coupon } from '@/types';

export const findCouponByCode = (coupons: Coupon[], code: string) => {
  return coupons.find((coupon) => coupon.code === code);
};
