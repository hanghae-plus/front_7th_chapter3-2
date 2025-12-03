import { useCallback, useState } from "react"
import { Coupon } from "../../types";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // 새 쿠폰 추가
  const addCoupon = useCallback((newCoupon: Coupon) => {
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    if (existingCoupon) {
      console.log('이미 존재하는 쿠폰 코드입니다.');
      //addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons([...coupons, newCoupon])
    console.log('쿠폰이 추가되었습니다.');
    //addNotification('쿠폰이 추가되었습니다.', 'success');
  }, [coupons]);

  // 쿠폰 삭제
  const removeCoupon = useCallback((couponCode: string) => {
    setCoupons(coupons.filter(coupon => coupon.code !== couponCode));
  }, [coupons]);

  return {
    coupons,
    addCoupon,
    removeCoupon,
  }
}