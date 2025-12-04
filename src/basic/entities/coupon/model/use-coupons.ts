import { Coupon } from '../../../../types';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';
import {
  COUPON_STORAGE_KEY,
  INITIAL_COUPONS,
} from '../config/coupon-constants';

// TODO: model 분리 및 features 분리 > toast는 features에서 처리
export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    COUPON_STORAGE_KEY,
    INITIAL_COUPONS
  );

  /** 쿠폰 추가 */
  const addCoupon = (coupon: Coupon) => {
    const existingCoupon = coupons.find((c) => c.code === coupon.code);

    // CHECK:  상태의 연결을 담당하는 곳에서 처리하는게 맞는건가?
    if (existingCoupon) {
      throw new Error('이미 존재하는 쿠폰 코드입니다.');
    }

    setCoupons((prev) => [...prev, coupon]);
  };

  /** 쿠폰 삭제 */
  const removeCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  };
  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
