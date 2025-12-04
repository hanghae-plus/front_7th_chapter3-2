import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coupon } from "../types/types";
import { INITIAL_COUPONS } from "../constants";
import { useNotificationStore } from "./useNotificationStore";

interface CouponStoreState {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export const useCouponStore = create<CouponStoreState>()(
  persist(
    (set, get) => ({
      coupons: INITIAL_COUPONS,
      selectedCoupon: null,

      addCoupon: (newCoupon) => {
        const { coupons } = get();
        const addNotification = useNotificationStore.getState().addNotification;

        const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
        if (existingCoupon) {
          addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
          return;
        }

        set({ coupons: [...coupons, newCoupon] });
        addNotification("쿠폰이 추가되었습니다.", "success");
      },

      deleteCoupon: (couponCode) => {
        const { coupons, selectedCoupon } = get();
        const addNotification = useNotificationStore.getState().addNotification;

        set({ coupons: coupons.filter((c) => c.code !== couponCode) });

        if (selectedCoupon?.code === couponCode) {
          set({ selectedCoupon: null });
        }

        addNotification("쿠폰이 삭제되었습니다.", "success");
      },

      setSelectedCoupon: (coupon) => {
        set({ selectedCoupon: coupon });
      },
    }),
    {
      name: "coupons",
    }
  )
);
