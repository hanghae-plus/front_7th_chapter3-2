import { Coupon } from '../../../../types';

export const checkCouponAvailability = (
  coupon: Coupon,
  currentCartTotal: number,
) => {
  if (currentCartTotal < 10000 && coupon.discountType === 'percentage') {
    return false;
  }
  return true;
};

export const applyCouponDiscount = (
  selectedCoupon: Coupon,
  {
    totalBeforeDiscount,
    totalAfterDiscount,
  }: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  },
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  if (selectedCoupon.discountType === 'amount') {
    totalAfterDiscount = Math.max(
      0,
      totalAfterDiscount - selectedCoupon.discountValue,
    );
  } else {
    totalAfterDiscount = Math.round(
      totalAfterDiscount * (1 - selectedCoupon.discountValue / 100),
    );
  }

  return { totalBeforeDiscount, totalAfterDiscount };
};
