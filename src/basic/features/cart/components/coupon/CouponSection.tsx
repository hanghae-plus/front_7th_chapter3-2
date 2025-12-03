import { Coupon } from '../../../../../types';
import { CouponSelector } from './CouponSelector';

export const CouponSection = ({
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  cartTotalPrice,
  applyCoupon,
}: {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  cartTotalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
  applyCoupon: (
    coupon: Coupon,
    { onSuccess }: { onSuccess?: () => void },
  ) => void;
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      {coupons.length > 0 && (
        <CouponSelector
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          coupons={coupons}
          cartTotalPrice={cartTotalPrice}
          applyCoupon={applyCoupon}
        />
      )}
    </section>
  );
};
