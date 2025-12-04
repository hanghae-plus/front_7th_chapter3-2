/**
 * Coupon Feature - useCoupon Hook
 * 
 * 쿠폰 상태 관리 및 CRUD 로직
 */

import { useCallback } from 'react';
import { Coupon } from '../entities/coupon/model';
import { isDuplicateCoupon } from '../entities/coupon/utils';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

interface UseCouponProps {
  initialCoupons: Coupon[];
  onNotify: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export const useCoupon = ({ initialCoupons, onNotify }: UseCouponProps) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  // 쿠폰 추가
  const addCoupon = useCallback((newCoupon: Coupon) => {
    if (isDuplicateCoupon(coupons, newCoupon.code)) {
      onNotify('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons(prev => [...prev, newCoupon]);
    onNotify('쿠폰이 추가되었습니다.', 'success');
  }, [coupons, onNotify, setCoupons]);

  // 쿠폰 삭제
  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    onNotify('쿠폰이 삭제되었습니다.', 'success');
  }, [onNotify, setCoupons]);

  return {
    coupons,
    addCoupon,
    deleteCoupon
  };
};
