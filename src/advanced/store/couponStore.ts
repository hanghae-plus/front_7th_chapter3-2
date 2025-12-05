import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";

interface CouponState {
  coupons: Coupon[];

  // 메서드
  addCoupon: (coupon: Coupon) => boolean;
  removeCoupon: (couponCode: string) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: initialCoupons,

      addCoupon: (newCoupon) => {
        const { coupons } = get();
        const existingCoupon = coupons.find(c => c.code === newCoupon.code);

        if (existingCoupon) {
          return false; // 중복 코드
        }

        set({ coupons: [...coupons, newCoupon] });
        return true;
      },

      // 쿠폰 삭제
      removeCoupon: (couponCode) => {
        const { coupons } = get();
        set({ coupons: coupons.filter(c => c.code !== couponCode) });
      },
    }),
    {
      name: 'coupons',
      // coupons 배열만 localStorage에 저장 (Basic 버전과 동일하게)
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          // 배열 형식으로 저장/로드
          const data = JSON.parse(str);
          return Array.isArray(data) ? data : data.coupons || [];
        },
        setItem: (name, value) => {
          // coupons 배열만 저장
          localStorage.setItem(name, JSON.stringify(value.state.coupons));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
