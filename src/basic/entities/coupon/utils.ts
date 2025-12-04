import { Coupon } from '../../../types';

const MIN_TOTAL_FOR_PERCENTAGE_COUPON = 10000;

// APPLY COUPON
export const canApplyCoupon = (total: number, coupon: Coupon) => {
  if (total < MIN_TOTAL_FOR_PERCENTAGE_COUPON && coupon.discountType === 'percentage') return false;
  return true;
};

// ADD COUPON
export const canAddCoupon = (coupons: Coupon[], newCoupon: Coupon) => {
  const existingCoupon = coupons.find(c => c.code === newCoupon.code);
  if (existingCoupon) return false;
  return true;
};
