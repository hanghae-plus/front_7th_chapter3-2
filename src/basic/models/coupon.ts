// TODO: 쿠폰 비즈니스 로직 (순수 함수)

import { Coupon } from "../../types";

/**
 * 쿠폰 할인 금액/비율을 포맷팅
 */
export const formatCouponDiscount = (coupon: Coupon): string => {
  return coupon.discountType === "amount"
    ? `${coupon.discountValue.toLocaleString()}원`
    : `${coupon.discountValue}%`;
};

/**
 * 쿠폰 선택 옵션 텍스트 생성
 */
export const getCouponOptionText = (coupon: Coupon): string => {
  return `${coupon.name} (${formatCouponDiscount(coupon)})`;
};
