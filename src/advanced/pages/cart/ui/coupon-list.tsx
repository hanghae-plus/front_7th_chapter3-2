import { Coupon } from '../../../../types';
import { useCart } from '../../../entities/cart/model/use-cart';
import { useApplyCoupon } from '../../../features/cart/apply-coupon';

interface PropsType {
  coupons: Coupon[];
}

export function CouponList({ coupons }: PropsType) {
  const { selectedCoupon } = useCart();
  const { handleApplyCoupon } = useApplyCoupon({ coupons });

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
