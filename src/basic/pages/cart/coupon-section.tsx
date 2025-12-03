import { Coupon } from '../../../types';
import { ConditionalRender } from '../../shared/ui/conditional-render';
import { CouponList } from './coupon-list';

interface PropsType {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
}

export function CouponSection({
  coupons,
  selectedCoupon,
  onApplyCoupon,
}: PropsType) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      <ConditionalRender condition={coupons.length > 0}>
        <CouponList
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onApplyCoupon={onApplyCoupon}
        />
      </ConditionalRender>
    </section>
  );
}
