import { Coupon } from "../../../types";
import { Select } from "../../../shared/components/ui/Select";

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onClearCoupon: () => void;
}

export function CouponSelector({
  coupons,
  selectedCoupon,
  onApplyCoupon,
  onClearCoupon,
}: CouponSelectorProps) {
  if (coupons.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      <Select
        value={selectedCoupon?.code || ""}
        onChange={(e) => {
          const coupon = coupons.find((c) => c.code === e.target.value);
          if (coupon) {
            onApplyCoupon(coupon);
          } else {
            onClearCoupon();
          }
        }}
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon) => (
          <option key={coupon.code} value={coupon.code}>
            {coupon.name} (
            {coupon.discountType === "amount"
              ? `${coupon.discountValue.toLocaleString()}원`
              : `${coupon.discountValue}%`}
            )
          </option>
        ))}
      </Select>
    </div>
  );
}
