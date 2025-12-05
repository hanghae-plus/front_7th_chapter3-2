import { create } from "zustand";
import { Coupon } from "../../../entities/coupon/model/types";
import { useNotificationStore } from "../../../shared/lib/notificationStore";

interface CouponState {
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [],

  setCoupons: (coupons) => set({ coupons }),

  addCoupon: (newCoupon) => {
    const { coupons } = get();
    const existing = coupons.find((c) => c.code === newCoupon.code);
    
    if (existing) {
      useNotificationStore
        .getState()
        .addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }

    set((state) => ({
      coupons: [...state.coupons, newCoupon],
    }));
    useNotificationStore
      .getState()
      .addNotification("쿠폰이 추가되었습니다.", "success");
  },

  deleteCoupon: (couponCode) => {
    set((state) => ({
      coupons: state.coupons.filter((c) => c.code !== couponCode),
    }));
    useNotificationStore
      .getState()
      .addNotification("쿠폰이 삭제되었습니다.", "success");
  },
}));