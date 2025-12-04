export interface CouponFormState {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
