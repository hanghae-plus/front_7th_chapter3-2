type CouponOption = {
  code: string;
  name: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type CouponSectionProps = {
  couponOptions: CouponOption[];
  selectedCouponCode: string;
  onSelectCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
};

export function CouponSection({
  couponOptions,
  selectedCouponCode,
  onSelectCoupon,
  onRemoveCoupon,
}: CouponSectionProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">
          쿠폰 등록
        </button>
      </div>
      {couponOptions.length > 0 && (
        <select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCouponCode}
          onChange={(e) => {
            if (e.target.value === "") {
              onRemoveCoupon();
            } else {
              onSelectCoupon(e.target.value);
            }
          }}>
          <option value="">쿠폰 선택</option>
          {couponOptions.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} (
              {coupon.discountType === "amount"
                ? `${coupon.discountValue.toLocaleString()}원`
                : `${coupon.discountValue}%`}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
}

