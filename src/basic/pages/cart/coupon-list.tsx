import { Coupon } from '../../../types';

interface PropsType {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
}

export function CouponList({
  coupons,
  selectedCoupon,
  onApplyCoupon,
}: PropsType) {
  if (coupons.length === 0) {
    return null;
  }

  return (
    <select
      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      value={selectedCoupon?.code || ''}
      onChange={(e) => {
        const coupon = coupons.find((c) => c.code === e.target.value);
        if (coupon) onApplyCoupon(coupon);
      }}
    >
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon) => (
        <option key={coupon.code} value={coupon.code}>
          {coupon.name} (
          {coupon.discountType === 'amount'
            ? `${coupon.discountValue.toLocaleString()}원`
            : `${coupon.discountValue}%`}
          )
        </option>
      ))}
    </select>
  );
}
