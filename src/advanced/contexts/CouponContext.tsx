import { createContext, useContext, ReactNode } from 'react';
import { useCoupons } from '../hooks/useCoupons';
import { useNotificationContext } from './NotificationContext';

type CouponContextType = ReturnType<typeof useCoupons>;

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotificationContext();
  const couponState = useCoupons(addNotification);

  return (
    <CouponContext.Provider value={couponState}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within CouponProvider');
  }
  return context;
};

