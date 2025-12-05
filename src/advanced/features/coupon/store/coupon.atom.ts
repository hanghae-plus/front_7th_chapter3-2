import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  Coupon,
  CouponValidation,
  validateAddCoupon,
  validateRemoveCoupon,
} from '@/features/coupon';

const initialCoupons: Coupon[] = [
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

// Base atom
export const couponsAtom = atomWithStorage<Coupon[]>('coupon', initialCoupons);

// Action atoms
export const addCouponAtom = atom(
  null,
  (
    get,
    set,
    {
      newCoupon,
      options,
    }: {
      newCoupon: Coupon;
      options?: {
        onSuccess?: (validation: CouponValidation) => void;
        onError?: (validation: CouponValidation) => void;
      };
    }
  ) => {
    const coupons = get(couponsAtom);
    const result = validateAddCoupon(coupons, newCoupon);

    if (!result.valid) {
      options?.onError?.(result);
      return;
    }

    set(couponsAtom, (prev) => [...prev, newCoupon]);
    options?.onSuccess?.(result);
  }
);

export const removeCouponAtom = atom(
  null,
  (
    get,
    set,
    {
      couponCode,
      options,
    }: {
      couponCode: string;
      options?: {
        onSuccess?: (validation: CouponValidation) => void;
        onError?: (validation: CouponValidation) => void;
      };
    }
  ) => {
    const coupons = get(couponsAtom);
    const result = validateRemoveCoupon(coupons, couponCode);

    if (!result.valid) {
      options?.onError?.(result);
      return;
    }

    set(couponsAtom, (prev) => prev.filter((c) => c.code !== couponCode));
    options?.onSuccess?.(result);
  }
);
