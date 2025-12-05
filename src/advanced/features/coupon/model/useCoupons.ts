import { useCouponStore } from "./couponStore";

/**
 * 쿠폰 관련 상태와 액션을 제공하는 커스텀 훅
 */
export const useCoupons = () => {
  const couponStore = useCouponStore();

  return {
    coupons: couponStore.coupons,
    addCoupon: couponStore.addCoupon,
    deleteCoupon: couponStore.deleteCoupon,
  };
};