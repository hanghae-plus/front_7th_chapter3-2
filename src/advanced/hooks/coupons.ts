import { useCallback } from 'react';
import { initialCoupons } from '../constants/coupons';
import { Coupon } from '../types/coupons';
import useLocalStorage from './local-storage';
import { AddNotification } from './notifications';

interface UseCouponsReturn {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

const useCoupons = (addNotification: AddNotification): UseCouponsReturn => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons(prev => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [setCoupons, addNotification]
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon
  };
};

export default useCoupons;
