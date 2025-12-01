import { Coupon } from '../../../../types';

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelect: (coupon: Coupon) => void;
  onClear: () => void;
}

// 쿠폰 선택 드롭다운 컴포넌트
export const CouponSelector = ({
  coupons,
  selectedCoupon,
  onSelect,
  onClear
}: CouponSelectorProps) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        쿠폰 선택
      </label>
      <select
        value={selectedCoupon?.code || ''}
        onChange={(e) => {
          const coupon = coupons.find(c => c.code === e.target.value);
          if (coupon) {
            onSelect(coupon);
          } else {
            onClear();
          }
        }}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
      >
        <option value="">쿠폰 선택 안함</option>
        {coupons.map(coupon => (
          <option key={coupon.code} value={coupon.code}>
            {coupon.name} ({coupon.discountType === 'amount' 
              ? `${coupon.discountValue.toLocaleString()}원 할인` 
              : `${coupon.discountValue}% 할인`})
          </option>
        ))}
      </select>
      {selectedCoupon && (
        <button
          onClick={onClear}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          쿠폰 제거
        </button>
      )}
    </div>
  );
};

