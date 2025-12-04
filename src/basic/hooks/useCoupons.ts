// TODO: 쿠폰 관리 Hook

import { useCallback } from 'react';
import { Coupon, NotificationFunction } from '../../types';
import { initialCoupons } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { couponModel } from '../models/coupon';

export function useCoupons(
  addNotification: NotificationFunction,
  onCouponDeleted?: (couponCode: string) => void
) {
  // 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );

  // 2. 쿠폰 추가/삭제
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons(couponModel.addCoupon(coupons, newCoupon));
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(couponModel.removeCoupon(couponCode, coupons));
      addNotification('쿠폰이 삭제되었습니다.', 'success');
      onCouponDeleted?.(couponCode);
    },
    [coupons, addNotification, onCouponDeleted, setCoupons]
  );

  // 반환할 값:
  // - coupons: 쿠폰 배열
  // - addCoupon: 새 쿠폰 추가
  // - removeCoupon: 쿠폰 삭제
  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
