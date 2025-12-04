import { useCallback, useState } from "react";
import { INITIAL_COUPONS } from "../constants";
import { Coupon } from "../types/types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCoupons = (
  addNotification: (
    message: string,
    type?: "success" | "error" | "warning"
  ) => void
) => {
  const [coupons, setCoupons] = useLocalStorage("coupons", INITIAL_COUPONS);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
  };
};
