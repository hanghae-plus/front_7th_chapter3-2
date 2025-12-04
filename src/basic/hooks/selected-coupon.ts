import { useEffect, useState } from 'react';
import { Coupon } from '../types/coupons';

/**
 * 선택된 쿠폰을 관리하고, 쿠폰이 삭제되면 자동으로 초기화합니다.
 */
const useSelectedCoupon = (coupons: Coupon[]) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 선택된 쿠폰이 삭제되면 자동으로 초기화
  useEffect(() => {
    if (selectedCoupon && !coupons.find(c => c.code === selectedCoupon.code)) {
      setSelectedCoupon(null);
    }
  }, [coupons, selectedCoupon]);

  return [selectedCoupon, setSelectedCoupon] as const;
};

export default useSelectedCoupon;

