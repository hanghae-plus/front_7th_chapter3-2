import { Coupon } from '../../../../types';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';

export const useCouponsStorage = (initialCoupons: Coupon[]) => {
  return useLocalStorageState<Coupon[]>('coupons', initialCoupons);
};
