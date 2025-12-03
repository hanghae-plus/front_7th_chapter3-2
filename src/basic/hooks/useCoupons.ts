import { useCallback } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialCoupons } from "../constants";

type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

/**
 * 쿠폰 관리를 위한 커스텀 훅
 * @param addNotification - 알림 함수 (옵션)
 */
export function useCoupons(addNotification?: NotifyFn) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification?.("이미 존재하는 쿠폰 코드입니다.", "error");
        return false;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification?.("쿠폰이 추가되었습니다.", "success");
      return true;
    },
    [coupons, setCoupons, addNotification]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      addNotification?.("쿠폰이 삭제되었습니다.", "success");
    },
    [setCoupons, addNotification]
  );

  return {
    coupons,
    handleAddCoupon,
    handleDeleteCoupon,
  };
}
