import { useCartStore } from '../../../entities/cart/model/useCartStore';
import { useCouponStore } from '../../../entities/coupon/model/useCouponStore';
import { useNotificationStore } from '../../../shared/store/useNotificationStore';
import { formatPrice } from '../../../shared/lib/formatters';

const CouponSelector = () => {
  const coupons = useCouponStore((state) => state.coupons);
  const selectedCoupon = useCartStore((state) => state.selectedCoupon);
  const setSelectedCoupon = useCartStore((state) => state.setSelectedCoupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleApplyCoupon = (couponCode: string) => {
    const coupon = coupons.find((c) => c.code === couponCode);
    if (coupon) {
      const result = applyCoupon(coupon);
      if (result.success) {
        addNotification(result.message || '쿠폰이 적용되었습니다.', 'success');
      } else {
        addNotification(result.message || '쿠폰 적용 실패', 'error');
      }
    } else {
      setSelectedCoupon(null);
    }
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      {coupons.length > 0 && (
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
                ? formatPrice(coupon.discountValue)
                : `${coupon.discountValue}%`}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
};

export default CouponSelector;
