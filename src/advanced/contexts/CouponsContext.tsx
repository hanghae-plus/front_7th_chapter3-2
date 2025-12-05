import React, { createContext, useContext, ReactNode } from 'react';
import { useCoupons } from '../hooks/useCoupons';
import { Coupon } from '../../types';

interface CouponsContextValue {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

const CouponsContext = createContext<CouponsContextValue | undefined>(
  undefined
);

export const CouponsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const couponsState = useCoupons();

  return (
    <CouponsContext.Provider value={couponsState}>
      {children}
    </CouponsContext.Provider>
  );
};

export const useCouponsContext = () => {
  const context = useContext(CouponsContext);

  if (!context) {
    throw new Error('useCouponsContext must be used within CouponsProvider');
  }
  return context;
};
