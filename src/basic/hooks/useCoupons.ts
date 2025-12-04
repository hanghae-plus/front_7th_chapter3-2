import { useCallback } from 'react';
import { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

/**
 * 쿠폰 관리 Hook
 * 쿠폰 목록 상태 관리 및 추가/삭제 기능 제공
 */
export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons(prev => [...prev, newCoupon]);
    return newCoupon;
  }, [setCoupons]);

  const removeCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
  }, [setCoupons]);

  return {
    coupons,
    addCoupon,
    removeCoupon
  };
}
