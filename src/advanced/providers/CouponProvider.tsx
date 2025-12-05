import { createContext, type Dispatch, type SetStateAction, useContext, useMemo } from 'react';
import { useCouponsStorage, type Coupon } from '../entities/coupon';
import { initialCoupons } from '../mock/coupon';
interface CouponContextType {
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
}

export const CouponContext = createContext<CouponContextType | null>(null);

export const CouponProvider = ({ children }: { children: React.ReactNode }) => {
  const [coupons, setCoupons] = useCouponsStorage(initialCoupons);

  const value = useMemo(() => ({ coupons, setCoupons }), [coupons, setCoupons]);
  return <CouponContext value={value}>{children}</CouponContext>;
};

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};
