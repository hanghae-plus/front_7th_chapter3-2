import { useCallback, useState } from "react";
import { CartItem, Coupon } from "../types";
import { initialCoupons } from "../constants";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { calculateCartTotal } from "../models/calculateCartTotal";

export const useCoupon = ({
  onSuccess,
  onError,
}: {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        onError("이미 존재하는 쿠폰 코드입니다.");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      onSuccess("쿠폰이 추가되었습니다.");
    },
    [coupons, onError, onSuccess, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      onSuccess("쿠폰이 삭제되었습니다.");
    },
    [selectedCoupon, onSuccess, setCoupons]
  );

  const applyCoupon = useCallback(
    (cart: CartItem[], coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        onError("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.");
        return;
      }

      setSelectedCoupon(coupon);
      onSuccess("쿠폰이 적용되었습니다.");
    },
    [onSuccess]
  );

  return {
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  };
};
