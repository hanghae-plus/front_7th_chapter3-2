import { Coupon } from '../../../../types';
import { useApplyCoupon } from '../../../features/cart/apply-coupon';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  toast: (notification: ToastProps) => void;
}

export function CouponList({
  coupons,
  selectedCoupon,
  applyCoupon,
  toast,
}: PropsType) {
  const { handleApplyCoupon } = useApplyCoupon({ coupons, applyCoupon, toast });
  return (
    <select
      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      value={selectedCoupon?.code || ''}
      onChange={handleApplyCoupon}
    >
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon) => (
        <option key={coupon.code} value={coupon.code}>
          {coupon.name} ({/* REFACTOR */}
          {coupon.discountType === 'amount'
            ? `${coupon.discountValue.toLocaleString()}원`
            : `${coupon.discountValue}%`}
          )
        </option>
      ))}
    </select>
  );
}
