import { useCallback, useEffect, useReducer } from 'react';
import { Coupon } from '../../../../types';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';
import {
  COUPON_STORAGE_KEY,
  INITIAL_COUPONS,
} from '../config/coupon-constants';
import { couponReducer, initialCouponState } from './coupon-reducer';
import { couponActions, validateAddCoupon } from './coupon-actions';

export function useCoupons() {
  // LocalStorage에서 초기 쿠폰 로드
  const [persistedCoupons, setPersistedCoupons] = useLocalStorage<Coupon[]>(
    COUPON_STORAGE_KEY,
    INITIAL_COUPONS
  );

  // Reducer로 상태 관리
  const [state, dispatch] = useReducer(couponReducer, {
    ...initialCouponState,
    items: persistedCoupons,
  });

  // LocalStorage 동기화
  useEffect(() => {
    setPersistedCoupons(state.items);
  }, [state.items, setPersistedCoupons]);

  /** 쿠폰 추가 */
  const addCoupon = useCallback(
    (coupon: Coupon) => {
      validateAddCoupon(state, coupon);
      dispatch(couponActions.addCoupon(coupon));
    },
    [state]
  );

  /** 쿠폰 삭제 */
  const removeCoupon = useCallback((couponCode: string) => {
    dispatch(couponActions.removeCoupon(couponCode));
  }, []);

  return {
    coupons: state.items,
    addCoupon,
    removeCoupon,
  };
}
