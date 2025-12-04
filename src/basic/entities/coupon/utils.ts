import { Coupon } from '../../../types';

const MIN_TOTAL_FOR_PERCENTAGE_COUPON = 10000;

export const canApplyCoupon = (total: number, coupon: Coupon) => {
  if (total < MIN_TOTAL_FOR_PERCENTAGE_COUPON && coupon.discountType === 'percentage') return false;
  return true;
};
