import { useAtomValue, useSetAtom } from 'jotai';
import {
  couponsAtom,
  addCouponAtom,
  removeCouponAtom,
} from '@/features/coupon/store/coupon.atom';
import { Coupon, CouponValidation } from '@/features/coupon';
import { useCallback } from 'react';

export function useCouponStore() {
  const coupons = useAtomValue(couponsAtom);

  const setAddCoupon = useSetAtom(addCouponAtom);
  const setRemoveCoupon = useSetAtom(removeCouponAtom);

  const addCoupon = useCallback(
    (
      newCoupon: Coupon,
      options?: {
        onSuccess?: (validation: CouponValidation) => void;
        onError?: (validation: CouponValidation) => void;
      }
    ) => {
      setAddCoupon({ newCoupon, options });
    },
    [setAddCoupon]
  );

  const removeCoupon = useCallback(
    (
      couponCode: string,
      options?: {
        onSuccess?: (validation: CouponValidation) => void;
        onError?: (validation: CouponValidation) => void;
      }
    ) => {
      setRemoveCoupon({ couponCode, options });
    },
    [setRemoveCoupon]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
