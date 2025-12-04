import { createContext, useContext, ReactNode } from "react";
import { useCoupons } from "../hooks/useCoupons";
import { initialCoupons } from "../constants";

type CouponContextType = ReturnType<typeof useCoupons>;

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const couponState = useCoupons(initialCoupons);

  return <CouponContext.Provider value={couponState}>{children}</CouponContext.Provider>;
};

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCouponContext must be used within CouponProvider");
  }
  return context;
};
