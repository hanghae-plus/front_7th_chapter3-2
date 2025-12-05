import { Coupon } from "../../../entities/coupon/model/types";
/**
 * 쿠폰을 적용할 수 있는지 판단하는 순수 함수
 * @param coupon 적용하려는 쿠폰
 * @param currentTotalAmount 현재 장바구니 총액 (할인 전)
 * @returns 적용 가능 여부
 */
export const canApplyCoupon = (
  coupon: Coupon,
  currentTotalAmount: number
): boolean => {
  // 비즈니스 규칙: 정률 할인은 10,000원 이상일 때만 가능
  if (coupon.discountType === "percentage" && currentTotalAmount < 10000) {
    return false;
  }
  return true;
};
