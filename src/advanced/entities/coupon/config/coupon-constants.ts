// TODO: 쿠폰 관련 상수 설정

import { Coupon } from '../../../../types';

// - initialCoupons: 초기 쿠폰 목록 (5000원 할인, 10% 할인)

export const INITIAL_COUPONS: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

export const COUPON_STORAGE_KEY = 'coupons';
