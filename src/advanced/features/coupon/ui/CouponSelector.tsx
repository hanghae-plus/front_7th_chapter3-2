import { useCartStore } from '@/features/cart';
import { useCouponStore } from '@/features/coupon';
import { useNotification } from '@/shared/contexts';
import { Select } from '@/shared/ui';

export const CouponSelector = () => {
  const { addNotification } = useNotification();
  const { coupons } = useCouponStore();
  const { selectedCoupon, applyCoupon } = useCartStore();

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
    <Select
      className="w-full text-sm"
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
    </Select>
  );
};
