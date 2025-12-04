import React from 'react';
import { Coupon } from '../../../types';
import { SelectOption } from '../primitives';
import { CouponSelectorView } from './CouponSelectorView';

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelectCoupon: (coupon: Coupon | null) => void;
}

/**
 * CouponSelector Container Component
 * - 비즈니스 로직: 쿠폰 포맷팅 (amount vs percentage), 쿠폰 찾기
 * - Pure UI는 CouponSelectorView로 위임
 */
export const CouponSelector: React.FC<CouponSelectorProps> = ({
  coupons,
  selectedCoupon,
  onSelectCoupon,
}) => {
  // 비즈니스 로직: 쿠폰 옵션 포맷팅
  const couponOptions: SelectOption[] = coupons.map((coupon) => ({
    value: coupon.code,
    label: `${coupon.name} (${
      coupon.discountType === 'amount'
        ? `${coupon.discountValue.toLocaleString()}원`
        : `${coupon.discountValue}%`
    })`,
  }));

  // 비즈니스 로직: 쿠폰 코드로 쿠폰 찾기
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
