import { Coupon } from "../../types";

const addCoupon = (coupons: Coupon[], newCoupon: Coupon) => {
  return [...coupons, newCoupon];
};

const deleteCoupon = (coupons: Coupon[], couponCode: string) => {
  return coupons.filter((coupon) => coupon.code !== couponCode);
};

const checkExistingCoupon = (coupons: Coupon[], newCoupon: Coupon) => {
  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  return !!existingCoupon;
};

export default { addCoupon, deleteCoupon, checkExistingCoupon };
