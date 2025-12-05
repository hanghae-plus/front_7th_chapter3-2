import { useCoupon, useCart, useNotification } from '../../hooks';

/**
 * 쿠폰 선택기 컴포넌트
 *
 * 쿠폰을 선택하여 적용할 수 있는 드롭다운을 렌더링합니다.
 * - 전역 상태에서 coupons, selectedCoupon 직접 접근
 * - props 없음
 */
export const CouponSelector = () => {
  const { coupons, selectedCoupon, applyCoupon, removeCoupon } = useCoupon();
  const { getCartTotal } = useCart();
  const { addNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find(c => c.code === e.target.value);

    if (!coupon) {
      removeCoupon();
      return;
    }

    // percentage 쿠폰은 10,000원 이상 구매 시 사용 가능
    const currentTotal = getCartTotal().totalAfterDiscount;
    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      addNotification(
        'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
        'error'
      );
      return;
    }

    applyCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
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
          onChange={handleChange}
        >
          <option value="">쿠폰 선택</option>
          {coupons.map(coupon => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} (
              {coupon.discountType === 'amount'
                ? `${coupon.discountValue.toLocaleString()}원`
                : `${coupon.discountValue}%`}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
};
