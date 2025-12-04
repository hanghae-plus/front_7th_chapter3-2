/**
 * Coupon Feature - useCoupon Hook
 * 
 * 쿠폰 상태 관리 및 CRUD 로직
 */
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { Coupon } from '../entities/coupon/model';
import { isDuplicateCoupon } from '../entities/coupon/utils';
import { couponsAtom } from '../shared/store/atoms';
import { useToast } from '../shared/hooks/useToast';

export const useCoupon = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const { addToast } = useToast();

  // 쿠폰 추가
  const addCoupon = useCallback((newCoupon: Coupon) => {
    if (isDuplicateCoupon(coupons, newCoupon.code)) {
      addToast('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons(prev => [...prev, newCoupon]);
    addToast('쿠폰이 추가되었습니다.', 'success');
  }, [addToast, coupons, setCoupons]);

  // 쿠폰 삭제
  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    addToast('쿠폰이 삭제되었습니다.', 'success');
  }, [addToast, setCoupons]);

  return {
    coupons,
    addCoupon,
    deleteCoupon
  };
};
