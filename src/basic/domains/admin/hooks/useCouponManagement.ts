import { useState, useCallback } from "react";
import { Coupon } from "../../../types";
import { CouponFormData } from "../../coupon/schemas/couponSchemas";

export function useCouponManagement(
  addCoupon: (
    data: Coupon,
    onNotify: (msg: string, type: "error" | "success") => void
  ) => boolean,
  deleteCoupon: (code: string) => void,
  selectedCoupon: Coupon | null,
  clearCoupon: () => void,
  onNotify: (message: string, type: "error" | "success") => void
) {
  const [showCouponForm, setShowCouponForm] = useState(false);

  const toggleCouponForm = useCallback(() => {
    setShowCouponForm((prev) => !prev);
  }, []);

  const closeCouponForm = useCallback(() => {
    setShowCouponForm(false);
  }, []);

  const handleAddCoupon = useCallback(
    (data: CouponFormData) => {
      const success = addCoupon(data, onNotify);
      if (success) {
        closeCouponForm();
      }
    },
    [addCoupon, onNotify, closeCouponForm]
  );

  const handleDeleteCoupon = useCallback(
    (code: string) => {
      deleteCoupon(code);
      if (selectedCoupon?.code === code) {
        clearCoupon();
      }
      onNotify("쿠폰이 삭제되었습니다.", "success");
    },
    [deleteCoupon, selectedCoupon, clearCoupon, onNotify]
  );

  return {
    showCouponForm,
    toggleCouponForm,
    closeCouponForm,
    handleAddCoupon,
    handleDeleteCoupon,
  };
}
