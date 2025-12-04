import { Coupon } from "../../types";

/**
 * 쿠폰 할인을 적용하여 최종 금액을 계산합니다
 * @param total 할인 전 금액
 * @param coupon 적용할 쿠폰
 * @returns 쿠폰 할인이 적용된 금액
 */
export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    // 정액 할인
    return Math.max(0, total - coupon.discountValue);
  } else {
    // 퍼센트 할인
    return Math.round(total * (1 - coupon.discountValue / 100));
  }
};

/**
 * 쿠폰 사용 가능 여부를 검증합니다
 * @param coupon 검증할 쿠폰
 * @param cartTotal 현재 장바구니 총액 (할인 전)
 * @returns 사용 가능 여부
 */
export const validateCoupon = (coupon: Coupon, cartTotal: number): boolean => {
  // percentage 쿠폰은 10,000원 이상 구매 시에만 사용 가능
  if (coupon.discountType === "percentage" && cartTotal < 10000) {
    return false;
  }

  return true;
};

/**
 * 쿠폰 사용 불가 사유를 반환합니다
 * @param coupon 검증할 쿠폰
 * @param cartTotal 현재 장바구니 총액 (할인 전)
 * @returns 사용 불가 사유 (사용 가능하면 null)
 */
export const getCouponErrorMessage = (coupon: Coupon, cartTotal: number): string | null => {
  if (coupon.discountType === "percentage" && cartTotal < 10000) {
    return "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.";
  }

  return null;
};
