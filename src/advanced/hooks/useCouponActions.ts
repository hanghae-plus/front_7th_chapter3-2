import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { couponsAtom, selectedCouponAtom } from '../store/atoms';
import { Coupon } from '../../types';

export const useCouponActions = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  const addCoupon = useCallback(
    (newCoupon: Coupon): boolean => {
      const existingCoupon = coupons.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        return false;
      }
      setCoupons(prev => [...prev, newCoupon]);
      return true;
    },
    [coupons, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon, setCoupons, setSelectedCoupon]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      setSelectedCoupon(coupon);
    },
    [setSelectedCoupon]
  );

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  return {
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearCoupon,
  };
};
