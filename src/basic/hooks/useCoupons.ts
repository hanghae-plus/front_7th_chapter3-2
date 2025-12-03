import { useEffect, useState } from 'react';
import type { Coupon } from '../../types';

interface UseCouponsOptions {
  initialCoupons: Coupon[];
}

export function useCoupons(options: UseCouponsOptions) {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return options.initialCoupons;
      }
    }
    return options.initialCoupons;
  });

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (newCoupon: Coupon): { ok: boolean; reason?: 'DUPLICATE_CODE' } => {
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    if (existingCoupon) {
      return { ok: false, reason: 'DUPLICATE_CODE' };
    }
    setCoupons(prev => [...prev, newCoupon]);
    return { ok: true };
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
  };

  return {
    coupons,
    setCoupons,
    addCoupon,
    deleteCoupon,
  };
}


