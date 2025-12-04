import { useCallback } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { addCouponToList, deleteCouponToList } from "../models/coupon";
import { Notification } from "../models/notificiation";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCoupons = (
  addNotification: (message: string, type: Notification["type"]) => void
) => {
  const [coupons, setCoupons] = useLocalStorage("coupons", initialCoupons);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prev) => {
      const newCoupons = addCouponToList(prev, newCoupon);

      if (newCoupons === prev) {
        addNotification("이미 존재하는 쿠폰 코드입니다", "error");
      } else {
        addNotification("쿠폰이 추가되었습니다", "success");
      }
      return newCoupons;
    });
  }, []);

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons((prev) => {
      const newCoupons = deleteCouponToList(prev, couponCode);

      // 삭제 성공 여부 확인
      const wasDeleted = newCoupons.length < prev.length;

      if (wasDeleted) {
        addNotification("쿠폰이 삭제되었습니다", "success");
      }

      return newCoupons;
    });
  }, []);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
};
