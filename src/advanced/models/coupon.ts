import { Coupon } from "../../types";

export const findCouponByCode = (
  coupons: Coupon[],
  code: string
): Coupon | undefined => {
  return coupons.find((c) => c.code === code);
};

export const addCouponToList = (
  coupons: Coupon[],
  newCoupon: Coupon
): Coupon[] => {
  return [...coupons, newCoupon];
};

export const removeCouponFromList = (
  coupons: Coupon[],
  code: string
): Coupon[] => {
  return coupons.filter((c) => c.code !== code);
};
