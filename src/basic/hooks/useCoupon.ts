import { useState, useCallback } from 'react';
import { Coupon } from '../../types';
import { useLocalStorage } from './useLocalStorage';

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

export const useCoupon = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

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
    [selectedCoupon, setCoupons]
  );

  const applyCoupon = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
  }, []);

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearCoupon,
  };
};
