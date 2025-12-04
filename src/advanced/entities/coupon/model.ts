/**
 * Coupon Entity - 타입 정의
 * 
 * 쿠폰 관련 도메인 타입
 */

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
