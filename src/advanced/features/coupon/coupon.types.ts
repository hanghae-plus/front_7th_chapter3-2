import { Validation } from '@/shared/types';

export type CouponValidationError =
  | 'DUPLICATED'
  | 'NOT_FOUND'
  | 'INVALID_DISCOUNT';
export type CouponValidation = Validation<CouponValidationError>;

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
