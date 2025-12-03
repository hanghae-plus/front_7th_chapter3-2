import { useCallback } from 'react';
import { Coupon } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_COUPONS, STORAGE_KEYS } from '../constants';

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    STORAGE_KEYS.COUPONS,
    INITIAL_COUPONS
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons((prev) => [...prev, newCoupon]);
    },
    [setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    },
    [setCoupons]
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
