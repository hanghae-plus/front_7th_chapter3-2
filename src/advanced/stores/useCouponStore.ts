import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '../../types';
import { initialCoupons, STORAGE_KEYS } from '../constants';

interface CouponState {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => boolean;
  removeCoupon: (couponCode: string) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: initialCoupons,

      addCoupon: (newCoupon) => {
        const existingCoupon = get().coupons.find(
          (c) => c.code === newCoupon.code
        );
        if (existingCoupon) {
          return false;
        }
        set((state) => ({
          coupons: [...state.coupons, newCoupon],
        }));
        return true;
      },

      removeCoupon: (couponCode) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== couponCode),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.COUPONS,
    }
  )
);
