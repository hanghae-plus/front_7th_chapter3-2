import { Validation } from '@/basic/types/validation.types';

export type CouponValidationError = 'DUPLICATED' | 'NOT_FOUND';
export type CouponValidation = Validation<CouponValidationError>;

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
