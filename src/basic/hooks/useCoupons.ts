import { useCallback, useState } from 'react';
import { Coupon } from '../../types';
import { useLocalStorage } from './useLocalStorage';

export interface UseCouponsReturn {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (coupon: Coupon) => boolean;
  deleteCoupon: (couponCode: string) => void;
  selectCoupon: (coupon: Coupon | null) => void;
}

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

/**
 * 쿠폰 데이터를 관리하는 엔티티 훅
 */
export function useCoupons(): UseCouponsReturn {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon): boolean => {
      const exists = coupons.some(c => c.code === newCoupon.code);
      if (exists) {
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

  const selectCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    selectCoupon,
  };
}
