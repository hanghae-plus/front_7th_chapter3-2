import { useCallback } from 'react';
import { Coupon } from '../../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

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
    'coupons',
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon): boolean => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        return false;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      return true;
    },
    [coupons, setCoupons]
  );

  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    },
    [setCoupons]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
