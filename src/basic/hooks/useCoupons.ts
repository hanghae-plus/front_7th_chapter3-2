import { useCallback, useState } from "react";
import { Coupon } from "../../types";
import couponModel from "../models/coupon";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const useCoupons = () => {
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

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
  }, []);

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => couponModel.deleteCoupon(prev, couponCode));
  }, []);

  return { data: coupons, addCoupon, deleteCoupon };
};

export default useCoupons;
