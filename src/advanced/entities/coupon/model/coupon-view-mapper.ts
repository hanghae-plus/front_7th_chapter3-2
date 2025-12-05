import { Coupon } from '../../../../types';
import { formatPercentage, formatPrice } from '../../../shared/lib/formatters';
import { CouponViewModel } from './coupon-view-model';

/** 할인 타입별 할인 텍스트 생성 */
const getDiscountText = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${formatPrice(coupon.discountValue)} 할인`;
  }
  return `${formatPercentage(coupon.discountValue)} 할인`;
};

/** Domain Model (Coupon)를 ViewModel로 변환 */
export const mapCouponToViewModel = (coupon: Coupon): CouponViewModel => {
  return {
    code: coupon.code,
    name: coupon.name,
    discountText: getDiscountText(coupon),
  };
};
