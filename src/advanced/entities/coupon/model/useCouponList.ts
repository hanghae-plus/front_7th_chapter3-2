import { useCouponStore } from '../../../shared/stores';
import { Coupon } from './types';

interface UseCouponListReturn {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
}

/**
 * 쿠폰 목록 도메인 훅
 * Zustand Store를 래핑하여 도메인 인터페이스 제공
 */
export const useCouponList = (): UseCouponListReturn => {
  const coupons = useCouponStore((state) => state.coupons);
  const addCoupon = useCouponStore((state) => state.addCoupon);
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
};
