import React from 'react';
import { Coupon } from '../../../types';
import { SelectOption } from '../primitives';
import { CouponSelectorView } from './CouponSelectorView';

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelectCoupon: (coupon: Coupon | null) => void;
}

export const CouponSelectorContainer: React.FC<CouponSelectorProps> = ({
  coupons,
  selectedCoupon,
  onSelectCoupon,
}) => {
  const couponOptions: SelectOption[] = coupons.map((coupon) => ({
    value: coupon.code,
    label: `${coupon.name} (${
      coupon.discountType === 'amount'
        ? `${coupon.discountValue.toLocaleString()}원`
        : `${coupon.discountValue}%`
    })`,
  }));

  const handleChange = (code: string) => {
    const coupon = coupons.find((c) => c.code === code);
    onSelectCoupon(coupon || null);
  };

  return (
    <CouponSelectorView
      couponOptions={couponOptions}
      selectedValue={selectedCoupon?.code || ''}
      onChange={handleChange}
    />
  );
};
