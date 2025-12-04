import { Coupon } from '../types/coupons';
import { formatCurrency } from '../utils/format';

const PERCENTAGE_COUPON_MIN_AMOUNT = 10000;

/**
 * 쿠폰 적용 가능 여부를 검증합니다.
 * @param coupon 적용하려는 쿠폰
 * @param totalAmount 현재 결제 예정 금액
 * @returns 검증 결과 { isValid: boolean, errorMessage?: string }
 */
export const validateCouponApplicability = (coupon: Coupon, totalAmount: number): { isValid: boolean; errorMessage?: string } => {
  if (totalAmount < PERCENTAGE_COUPON_MIN_AMOUNT && coupon.discountType === 'percentage') {
    return {
      isValid: false,
      errorMessage: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.'
    };
  }

  return { isValid: true };
};

/**
 * 쿠폰 목록에서 코드로 쿠폰을 찾습니다.
 */
export const findCouponByCode = (coupons: Coupon[], code: string): Coupon | undefined => {
  return coupons.find(c => c.code === code);
};

/**
 * 쿠폰 할인 정보를 표시용 문자열로 포맷팅합니다.
 */
export const formatCouponDiscount = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${formatCurrency(coupon.discountValue, { suffix: '원' })} 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};

/**
 * 쿠폰 목록을 Select 옵션으로 변환합니다.
 */
export const convertCouponsToOptions = (coupons: Coupon[]): Array<{ label: string; value: string }> => {
  return coupons.map(coupon => ({
    label: `${coupon.name} (${formatCouponDiscount(coupon)})`,
    value: coupon.code
  }));
};
