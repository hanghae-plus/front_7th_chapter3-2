import { useCallback, useEffect, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";

type Props = {
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

const useCoupons = ({ addNotification }: Props) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });
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

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  return {
    coupons,
    selectedCoupon,
    setCoupons,
    setSelectedCoupon,
    addCoupon,
  };
};

export default useCoupons;
