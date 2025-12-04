import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import {
  Coupon,
  CouponValidation,
  validateAddCoupon,
  validateRemoveCoupon,
} from '@/features/coupon';
import { useCallback } from 'react';

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

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupon',
    initialCoupons
  );

  const addCoupon = useCallback(
    (
      newCoupon: Coupon,
      options?: {
        onSuccess?: (validation: CouponValidation) => void;
        onError?: (validation: CouponValidation) => void;
      }
    ) => {
      const result = validateAddCoupon(coupons, newCoupon);
      if (!result.valid) {
        options?.onError?.(result);
        return;
      }

      setCoupons((prev) => [...prev, newCoupon]);
      options?.onSuccess?.(result);
    },
    [coupons, setCoupons]
  );

  const removeCoupon = useCallback(
    (
      couponCode: string,
      options?: {
        onSuccess?: (validation: CouponValidation) => void;
        onError?: (validation: CouponValidation) => void;
      }
    ) => {
      const result = validateRemoveCoupon(coupons, couponCode);
      if (!result.valid) {
        options?.onError?.(result);
        return;
      }

      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      options?.onSuccess?.(result);
    },
    [coupons, setCoupons]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
