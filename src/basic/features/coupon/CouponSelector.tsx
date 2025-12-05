import type { Coupon } from '../../../types';

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApply: (coupon: Coupon | null) => void;
}

/**
 * 쿠폰 선택기 컴포넌트
 *
 * 쿠폰을 선택하여 적용할 수 있는 드롭다운을 렌더링합니다.
 */
export const CouponSelector = ({
  coupons,
  selectedCoupon,
  onApply
}: CouponSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find(c => c.code === e.target.value);
    onApply(coupon || null);
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
