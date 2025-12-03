import { CartItem, Coupon } from "../../../../types";
import { Button } from "../../../components/common/ui/Button";
import { calculateCartTotal } from "../../../models/cart";
import {
  validateCoupon,
  calculateTotalBeforeCoupon,
} from "../../../models/coupon";

interface ShoppingCouponSelectProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const ShoppingCouponSelect = ({
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleNotificationAdd,
}: ShoppingCouponSelectProps) => {
  const applyCoupon = (coupon: Coupon) => {
    const currentTotal = calculateTotalBeforeCoupon(cart);
    const validation = validateCoupon(coupon, currentTotal);

    if (!validation.isValid) {
      handleNotificationAdd(validation.errorMessage || "", "error");
      return;
    }

    setSelectedCoupon(coupon);
    handleNotificationAdd("쿠폰이 적용되었습니다.", "success");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <Button variant="text" size="xs">
          쿠폰 등록
        </Button>
      </div>
      {coupons.length > 0 && (
        <select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ""}
          onChange={(e) => {
            const coupon = coupons.find((c) => c.code === e.target.value);
            if (coupon) applyCoupon(coupon);
            else setSelectedCoupon(null);
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
        </select>
      )}
    </section>
  );
};
