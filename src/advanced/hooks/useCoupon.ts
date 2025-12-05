import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import type { Coupon } from '../../types';
import {
  couponsAtom,
  selectedCouponAtom,
  applyCouponAtom,
  removeCouponAtom,
  addCouponAtom,
  deleteCouponAtom
} from '../atoms';

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
 * 쿠폰 관리 훅 (Jotai adapter)
 *
 * 기존 인터페이스를 유지하면서 내부적으로 Jotai atom 사용
 *
 * @returns 쿠폰 목록, 선택된 쿠폰, 쿠폰 관리 액션들
 */
export const useCoupon = (): UseCouponReturn => {
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const applyCouponAction = useSetAtom(applyCouponAtom);
  const removeCouponAction = useSetAtom(removeCouponAtom);
  const addCouponAction = useSetAtom(addCouponAtom);
  const deleteCouponAction = useSetAtom(deleteCouponAtom);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      applyCouponAction(coupon);
    },
    [applyCouponAction]
  );

  const removeCoupon = useCallback(() => {
    removeCouponAction();
  }, [removeCouponAction]);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      addCouponAction(newCoupon);
    },
    [addCouponAction]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      deleteCouponAction(code);
    },
    [deleteCouponAction]
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
