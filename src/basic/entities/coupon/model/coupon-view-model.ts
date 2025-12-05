/** Coupon UI 표시를 위한 ViewModel */
export interface CouponViewModel {
  /** 쿠폰 코드 */
  code: string;
  /** 쿠폰 이름 */
  name: string;
  /** 포맷된 할인 텍스트 (예: "5,000원 할인", "10% 할인") */
  discountText: string;
}
