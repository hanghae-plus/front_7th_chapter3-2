import { validateAddCoupon, validateRemoveCoupon } from '@/models/coupon';
import { Coupon, CouponValidation } from '@/types';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';
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
    (newCoupon: Coupon): CouponValidation => {
      const result = validateAddCoupon(coupons, newCoupon);
      if (result.valid) setCoupons((prev) => [...prev, newCoupon]);
      return result;
    },
    [coupons, setCoupons]
  );

  const removeCoupon = useCallback(
    (couponCode: string): CouponValidation => {
      const result = validateRemoveCoupon(coupons, couponCode);
      if (result.valid)
        setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      return result;
    },
    [coupons, setCoupons]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
