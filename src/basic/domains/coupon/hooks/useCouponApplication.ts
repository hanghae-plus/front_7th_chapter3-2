import { useState, useCallback } from "react";
import { Coupon } from "../../../types";
import { MIN_COUPON_AMOUNT_FOR_PERCENTAGE } from "../../../lib/constants";

export function useCouponApplication(
  onNotify: (message: string, type: "error" | "success") => void
) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = useCallback(
    (coupon: Coupon, currentTotal: number) => {
      if (
        currentTotal < MIN_COUPON_AMOUNT_FOR_PERCENTAGE &&
        coupon.discountType === "percentage"
      ) {
        onNotify(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return false;
      }

      setSelectedCoupon(coupon);
      onNotify("쿠폰이 적용되었습니다.", "success");
      return true;
    },
    [onNotify]
  );

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const handleApplyCoupon = useCallback(
    (coupon: Coupon | null, currentTotal: number) => {
      if (coupon) {
        applyCoupon(coupon, currentTotal);
      }
    },
    [applyCoupon]
  );

  return {
    selectedCoupon,
    applyCoupon,
    clearCoupon,
    setSelectedCoupon,
    handleApplyCoupon,
  };
}
