export type DiscountType = 'amount' | 'percentage';

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}
