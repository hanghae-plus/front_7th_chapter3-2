import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '../../entities/coupon/model/types';
import { initialCoupons } from '../../entities/coupon/model/data';
import { STORAGE_KEYS } from '../config/storageKeys';

interface CouponStore {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
}

export const useCouponStore = create<CouponStore>()(
  persist(
    (set) => ({
      coupons: initialCoupons,

      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [...state.coupons, coupon],
        })),

      deleteCoupon: (code) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code),
        })),
    }),
    {
      name: STORAGE_KEYS.COUPONS,
    },
  ),
);
