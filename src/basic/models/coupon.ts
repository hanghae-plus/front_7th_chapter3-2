import { Coupon } from '../../types';

/**
 * 쿠폰 할인 금액 계산
 */
export const calculateCouponDiscount = ({
  coupon,
  totalAmount,
}: {
  coupon: Coupon;
  totalAmount: number;
}) => {
  if (coupon.discountType === 'amount') {
    return Math.min(coupon.discountValue, totalAmount);
  } else {
    return Math.round(totalAmount * (coupon.discountValue / 100));
  }
};

/**
 * 쿠폰 적용 가능 여부 확인
 */
export const canApplyCoupon = ({
  coupon,
  totalAmount,
}: {
  coupon: Coupon;
  totalAmount: number;
}) => {
  // percentage 쿠폰은 10,000원 이상만 사용 가능
  if (coupon.discountType === 'percentage' && totalAmount < 10000) {
    return false;
  }
  return true;
};

/**
 * 쿠폰 할인 후 금액 계산
 */
export const applyCouponDiscount = ({
  coupon,
  totalAmount,
}: {
  coupon: Coupon;
  totalAmount: number;
}) => {
  const discountAmount = calculateCouponDiscount({ coupon, totalAmount });
  return Math.max(0, totalAmount - discountAmount);
};

/**
 * 쿠폰 표시 텍스트 생성
 */
export const getCouponDisplayText = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  } else {
    return `${coupon.discountValue}% 할인`;
  }
};

/**
 * 쿠폰 코드 유효성 검사
 */
export const isValidCouponCode = (code: string): boolean => {
  return code.length > 0 && /^[A-Z0-9]+$/.test(code);
};
