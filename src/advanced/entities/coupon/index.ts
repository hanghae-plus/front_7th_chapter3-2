export { INITIAL_COUPONS } from './config/coupon-constants';
export { CouponProvider, useCoupons } from './model/use-coupons';
export { CouponItem } from './ui/coupon-item';
export {
  findCouponByCode,
  isDuplicateCouponCode,
  isValidCoupon,
  isValidCouponName,
  isValidDiscountValue,
} from './model/coupon-utils';
export type { CouponViewModel } from './model/coupon-view-model';
export { mapCouponToViewModel } from './model/coupon-view-mapper';
