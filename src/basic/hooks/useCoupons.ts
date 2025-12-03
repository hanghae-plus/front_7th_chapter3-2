import { useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants/data";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return { coupons, setCoupons, selectedCoupon, setSelectedCoupon };
};
