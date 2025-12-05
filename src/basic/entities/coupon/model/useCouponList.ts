import { useCallback } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { initialCoupons } from './data';
import { Coupon } from './types';
import { STORAGE_KEYS } from '../../../shared/config/storageKeys';

export const useCouponList = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    STORAGE_KEYS.COUPONS,
    initialCoupons,
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
    },
    [setCoupons],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.code !== couponCode),
      );
    },
    [setCoupons],
  );

  return { coupons, addCoupon, deleteCoupon };
};
