import { useCallback } from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialCoupons } from "../constants";
import * as couponModel from "../models/coupon";

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

  // 새 쿠폰 추가
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const result = couponModel.addCoupon(coupons, newCoupon);
      if (result.success) {
        setCoupons(result.coupons);
        addNotification?.("쿠폰이 추가되었습니다.", "success");
        return true;
      } else {
        addNotification?.("이미 존재하는 쿠폰 코드입니다.", "error");
        return false;
      }
    },
    [coupons, setCoupons, addNotification]
  );

  // 쿠폰 삭제
  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(couponModel.removeCoupon(coupons, couponCode));
      addNotification?.("쿠폰이 삭제되었습니다.", "success");
    },
    [coupons, setCoupons, addNotification]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
