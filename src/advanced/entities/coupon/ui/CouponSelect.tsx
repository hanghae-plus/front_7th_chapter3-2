import { ChangeEvent } from 'react';
import { Coupon } from '../model/types';
import { Select } from '../../../shared/ui/Select';
import { getCouponLabel } from '../lib';

interface CouponSelectProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onChange: (coupon: Coupon | null) => void;
  className?: string;
}

export const CouponSelect = ({
  coupons,
  selectedCoupon,
  onChange,
  className,
}: CouponSelectProps) => {
  // select의 onChange 이벤트(쿠폰 코드)를 받아서 -> 쿠폰 객체로 변환
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const couponCode = e.target.value;
    // 선택된 쿠폰을 찾아서 부모에게 전달
    const coupon = coupons.find((c) => c.code === couponCode);
    if (coupon) {
      onChange(coupon);
    } else {
      onChange(null);
    }
  };

  return (
    <Select
      onChange={handleChange}
      value={selectedCoupon?.code || ''}
      className={className}
    >
      <option value="">쿠폰 선택</option>

      {coupons.map((coupon) => (
        <option key={coupon.code} value={coupon.code}>
          {coupon.name} ({getCouponLabel(coupon)})
        </option>
      ))}
    </Select>
  );
};
