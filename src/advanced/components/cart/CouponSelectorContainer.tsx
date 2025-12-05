import React from 'react';
import { Coupon } from '../../../types';
import { SelectOption } from '../primitives';
import { CouponSelectorView } from './CouponSelectorView';
import { useCouponsContext } from '../../contexts';
import { getCouponDisplayText } from '../../models/coupon';

interface CouponSelectorProps {
  selectedCoupon: Coupon | null;
  onSelectCoupon: (coupon: Coupon | null) => void;
}

export const CouponSelectorContainer: React.FC<CouponSelectorProps> = ({
  selectedCoupon,
  onSelectCoupon,
}) => {
  const { coupons } = useCouponsContext();

  const couponOptions: SelectOption[] = coupons.map((coupon) => ({
    value: coupon.code,
    label: `${coupon.name} (${getCouponDisplayText(coupon).replace(
      ' 할인',
      ''
    )})`,
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
