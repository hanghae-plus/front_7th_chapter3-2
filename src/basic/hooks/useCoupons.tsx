import { useCallback, useEffect, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { useLocalStorage } from "./useLocalStorage";
import { getCouponErrorMessage } from "../utils/couponCalculations";

type Props = {
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

const useCoupons = ({ addNotification }: Props) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>("coupons", initialCoupons);

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

  const applyCoupon = useCallback(
    (coupon: Coupon, cartTotal: number) => {
      const errorMessage = getCouponErrorMessage(coupon, cartTotal);

      if (errorMessage) {
        addNotification(errorMessage, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification]
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
    selectedCoupon,
    applyCoupon,
    setCoupons,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
  };
};

export default useCoupons;
