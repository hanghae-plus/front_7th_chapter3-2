import { createContext, type Dispatch, type SetStateAction, useContext } from 'react';
import { useCouponsStorage } from '../hooks/useCouponsStorage';
import { initialCoupons } from '../../../mock/coupon';
import { type Coupon } from '../types';
interface CouponContextType {
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
}

export const CouponContext = createContext<CouponContextType | null>(null);

export const CouponProvider = ({ children }: { children: React.ReactNode }) => {
  const [coupons, setCoupons] = useCouponsStorage(initialCoupons);
  return <CouponContext value={{ coupons, setCoupons }}>{children}</CouponContext>;
};

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};
