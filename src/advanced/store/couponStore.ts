import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { getCouponErrorMessage } from "../utils/couponCalculations";
import { useNotificationStore } from "./notificationStore";

type CouponState = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
};

type CouponActions = {
  addCoupon: (newCoupon: Coupon) => void;
  applyCoupon: (coupon: Coupon, cartTotal: number) => void;
  deleteCoupon: (couponCode: string) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setCoupons: (coupons: Coupon[]) => void;
  reset: () => void;
};

export type CouponStore = CouponState & CouponActions;

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: initialCoupons,
      selectedCoupon: null,

      addCoupon: (newCoupon) => {
        const { coupons } = get();
        const existingCoupon = coupons.find((c) => c.code === newCoupon.code);

        if (existingCoupon) {
          useNotificationStore.getState().addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
          return;
        }

        set((state) => ({
          coupons: [...state.coupons, newCoupon],
        }));

        useNotificationStore.getState().addNotification("쿠폰이 추가되었습니다.", "success");
      },

      applyCoupon: (coupon, cartTotal) => {
        const errorMessage = getCouponErrorMessage(coupon, cartTotal);

        if (errorMessage) {
          useNotificationStore.getState().addNotification(errorMessage, "error");
          return;
        }

        set({ selectedCoupon: coupon });
        useNotificationStore.getState().addNotification("쿠폰이 적용되었습니다.", "success");
      },

      deleteCoupon: (couponCode) => {
        const { selectedCoupon } = get();

        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== couponCode),
          selectedCoupon: selectedCoupon?.code === couponCode ? null : selectedCoupon,
        }));

        useNotificationStore.getState().addNotification("쿠폰이 삭제되었습니다.", "success");
      },

      setSelectedCoupon: (coupon) => {
        set({ selectedCoupon: coupon });
      },

      setCoupons: (coupons) => {
        set({ coupons });
      },

      reset: () => {
        set({ coupons: initialCoupons, selectedCoupon: null });
      },
    }),
    {
      name: "coupons", // localStorage key
    }
  )
);
