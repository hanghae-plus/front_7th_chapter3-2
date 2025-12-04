import { formatPercentage, formatPrice } from '../../../shared/lib/formatters';
import { Coupon } from '../model/types';

/**
 * 쿠폰 혜택 문구 생성
 * 예: "5,000원 할인" 또는 "10% 할인"
 */
export const getCouponLabel = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${formatPrice(coupon.discountValue)}원 할인`;
  }
  return `${formatPercentage(coupon.discountValue / 100)} 할인`; // 10 -> 0.1로 변환 가정, 데이터에 따라 조정
};
