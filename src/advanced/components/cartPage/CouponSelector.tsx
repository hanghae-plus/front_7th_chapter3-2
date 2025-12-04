import { type FC } from "react";
import { Coupon } from "../../../types";
import { getCouponOptionText } from "../../models/coupon";

interface IProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApply: (coupon: Coupon | null) => void;
}

const CouponSelector: FC<IProps> = ({ coupons, selectedCoupon, onApply }) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
      </div>
      {coupons.length > 0 && (
        <select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ""}
          onChange={(e) => {
            const coupon = coupons.find((c) => c.code === e.target.value);
            onApply(coupon || null);
          }}>
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {getCouponOptionText(coupon)}
            </option>
          ))}
        </select>
      )}
    </section>
  );
};

export default CouponSelector;
