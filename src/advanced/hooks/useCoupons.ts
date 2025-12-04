import { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import { useLocalStorage } from './useLocalStorage';
import * as couponModel from '../models/coupon';

type NotificationFn = (
  message: string,
  type: 'error' | 'success' | 'warning'
) => void;

export const useCoupons = (addNotification?: NotificationFn) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );

  const addCoupon = (newCoupon: Coupon) => {
    // validate
    const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
    if (existingCoupon) {
      addNotification?.('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons((prev) => couponModel.addCoupon(newCoupon, prev));
    addNotification?.('쿠폰이 추가되었습니다.', 'success');
  };

  const removeCoupon = (couponCode: string) => {
    const existingCoupon = coupons.find((c) => c.code === couponCode);
    if (!existingCoupon) {
      addNotification?.('존재하지 않는 쿠폰 코드입니다.', 'error');
      return;
    }

    setCoupons((prev) => couponModel.removeCoupon(couponCode, prev));
  };

  return { coupons, setCoupons, addCoupon, removeCoupon };
};
