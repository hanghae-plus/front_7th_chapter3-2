import { useCallback } from "react"
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialCoupons } from "../constants";

export const useCoupons = (
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void
) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  // 새 쿠폰 추가
  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons(prev => {
      const existingCoupon = prev.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return prev;
      }
      addNotification('쿠폰이 추가되었습니다.', 'success');
      return [...prev, newCoupon];
    });
  }, [setCoupons, addNotification]);

  // 쿠폰 삭제
  const removeCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(coupon => coupon.code !== couponCode));
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  }, [setCoupons, addNotification]);

  return {
    coupons,
    addCoupon,
    removeCoupon,
  }
}
