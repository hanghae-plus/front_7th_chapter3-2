import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Coupon } from "../../types";
import couponModel from "../models/coupon";
import { initialCoupons } from "../constants";

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

interface CouponProviderProps {
  children: ReactNode;
}

const CouponContext = createContext<CouponContextType | null>(null);

export function CouponProvider({ children }: CouponProviderProps) {
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

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
  }, []);

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => couponModel.deleteCoupon(prev, couponCode));
  }, []);

  return <CouponContext.Provider value={{ coupons, addCoupon, deleteCoupon }}>{children}</CouponContext.Provider>;
}

export function useCoupons() {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCoupons must be used within a CouponProvider");
  }

  return context;
}
