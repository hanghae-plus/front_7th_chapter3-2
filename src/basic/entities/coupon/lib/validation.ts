import { COUPON_CONFIG } from '../config';
import { Coupon } from '../model/types';

export const canApplyCoupon = (
  coupon: Coupon,
  totalAmount: number,
): boolean => {
  if (
    coupon.discountType === 'percentage' &&
    totalAmount < COUPON_CONFIG.MIN_ORDER_FOR_PERCENTAGE_DISCOUNT
  ) {
    return false;
  }
  return true;
};

export const isValidCouponCode = (code: string): boolean => {
  const regex = /^[A-Z0-9]{4,12}$/;
  return regex.test(code);
};
