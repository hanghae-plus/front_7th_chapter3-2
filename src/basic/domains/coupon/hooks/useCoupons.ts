import { useState, useEffect, useCallback } from "react";
import { Coupon } from "../../../types";
import { INITIAL_COUPONS, STORAGE_KEYS } from "../../../lib/constants";

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback(
    (
      newCoupon: Coupon,
      onNotify: (message: string, type: "error" | "success") => void
    ) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        onNotify("이미 존재하는 쿠폰 코드입니다.", "error");
        return false;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      onNotify("쿠폰이 추가되었습니다.", "success");
      return true;
    },
    [coupons]
  );

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
  }, []);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
