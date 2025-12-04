import { useLocalStorageState } from '../../../hooks/useLocalStorageState';
import { Coupon } from '../types';

export const useCouponsStorage = (initialCoupons: Coupon[]) => {
  return useLocalStorageState<Coupon[]>('coupons', initialCoupons);
};
