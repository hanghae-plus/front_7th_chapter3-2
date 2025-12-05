import { StateCreator } from "zustand";
import { Coupon } from "../../lib/types";
import { INITIAL_COUPONS, STORAGE_KEYS } from "../../lib/constants";
import { NotificationSlice } from "./notificationSlice";

export interface CouponSlice {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

export const createCouponSlice: StateCreator<
  CouponSlice & NotificationSlice,
  [],
  [],
  CouponSlice
> = (set, get) => ({
  coupons: (() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  })(),

  addCoupon: (newCoupon: Coupon) => {
    const { coupons, addNotification } = get();

    const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
    if (existingCoupon) {
      addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }

    const newCoupons = [...coupons, newCoupon];
    set({ coupons: newCoupons });
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(newCoupons));
    addNotification("쿠폰이 추가되었습니다.", "success");
  },

  deleteCoupon: (couponCode: string) => {
    set((state) => {
      const newCoupons = state.coupons.filter((c) => c.code !== couponCode);
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(newCoupons));
      return { coupons: newCoupons };
    });
  },
});
