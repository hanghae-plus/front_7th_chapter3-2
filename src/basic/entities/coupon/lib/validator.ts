import { Coupon } from "../model/types";

export const validateCoupon = (coupon: Omit<Coupon, 'name' | 'code'>): { isValid: boolean; message?: string } => {
  const { discountType, discountValue } = coupon;

  if (discountType === 'percentage') {
    if (discountValue > 100) {
      return { isValid: false, message: '할인율은 100%를 초과할 수 없습니다' };
    }
    if (discountValue < 0) {
      return { isValid: false, message: '할인율은 0% 미만이 될 수 없습니다' };
    }
  } else if (discountType === 'amount') {
    if (discountValue > 100000) {
      return { isValid: false, message: '할인 금액은 100,000원을 초과할 수 없습니다' };
    }
    if (discountValue < 0) {
      return { isValid: false, message: '할인 금액은 0원 미만이 될 수 없습니다' };
    }
  }

  return { isValid: true };
};
