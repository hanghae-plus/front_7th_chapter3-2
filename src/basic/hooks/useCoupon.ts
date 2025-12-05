import { useState, useCallback } from 'react';
import type { Coupon } from '../../types';
import { useLocalStorage } from './useLocalStorage';

/**
 * useCoupon 훅 반환 타입
 */
export interface UseCouponReturn {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
}

/**
 * 초기 쿠폰 데이터
 */
const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

/**
 * 쿠폰 관리 훅
 *
 * @returns 쿠폰 목록, 선택된 쿠폰, 쿠폰 관리 액션들
 */
export const useCoupon = (): UseCouponReturn => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
  }, []);

  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons(prev => [...prev, newCoupon]);
    },
    [setCoupons]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      setCoupons(prev => prev.filter(c => c.code !== code));
      // 삭제된 쿠폰이 선택된 쿠폰이면 선택 해제
      setSelectedCoupon(prev => (prev?.code === code ? null : prev));
    },
    [setCoupons]
  );

  return {
    coupons,
    selectedCoupon,
    applyCoupon,
    removeCoupon,
    addCoupon,
    deleteCoupon
  };
};
