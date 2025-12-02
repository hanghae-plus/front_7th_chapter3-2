import { useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    return saved ? JSON.parse(saved) : initialCoupons;
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const calculateCartTotal = () => {
    let total = 0;
    let discount = 0;

    if (selectedCoupon) {
      if (selectedCoupon.discountType === "percentage") {
        discount = (total * selectedCoupon.discountValue) / 100;
      } else if (selectedCoupon.discountType === "amount") {
        discount = selectedCoupon.discountValue;
      }
    }

    const totalAfterDiscount = Math.max(total - discount, 0);
    return { total, discount, totalAfterDiscount };
  };

  const applyCoupon = (coupon: Coupon) => {
    const currentTotal = calculateCartTotal().totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      // addNotification(
      //   "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
      //   "error"
      // );
      return;
    }

    setSelectedCoupon(coupon);
    // addNotification("쿠폰이 적용되었습니다.", "success");
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
    // addNotification("쿠폰이 제거되었습니다.", "info");
  };

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    removeCoupon,
  };
};
