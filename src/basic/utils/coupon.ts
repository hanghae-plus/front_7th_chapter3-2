import { Coupon } from '../types/coupons';

/**
 * 쿠폰 할인 정보를 표시용 문자열로 포맷팅합니다.
 */
export const formatCouponDiscount = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};

