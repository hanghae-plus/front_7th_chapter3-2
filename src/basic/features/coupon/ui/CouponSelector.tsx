import { CartValidation } from '@/features/cart';
import { Coupon } from '@/features/coupon';
import { Notification } from '@/shared/hooks';

export const CouponSelector = ({
  coupons,
  selectedCoupon,
  applyCoupon,
  addNotification,
}: {
  coupons: Coupon[];
  selectedCoupon?: Coupon | null;
  applyCoupon: (
    coupon: Coupon,
    options?: {
      onSuccess?: (validation: CartValidation) => void;
      onError?: (validation: CartValidation) => void;
    }
  ) => void;
  addNotification: (message: string, type: Notification['type']) => void;
}) => {
  const handleApplyCoupon = (couponCode: string) => {
    if (!couponCode) return;

    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      addNotification('쿠폰을 찾을 수 없습니다', 'error');
      return;
    }

    applyCoupon(coupon, {
      onSuccess: ({ message }) =>
        addNotification(message || '쿠폰이 적용되었습니다', 'success'),
      onError: ({ message }) => addNotification(message, 'error'),
    });
  };

  return (
    <select
      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      value={selectedCoupon?.code || ''}
      onChange={(e) => handleApplyCoupon(e.target.value)}
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
};
