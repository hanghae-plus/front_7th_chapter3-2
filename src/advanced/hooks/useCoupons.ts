import { useAtom } from "jotai";
import { Coupon } from "../../types";
import { addCouponToList, deleteCouponToList } from "../models/coupon";
import { couponsAtom } from "../stores/atoms";
import { useAddNotification } from "./useNotification";

export const useCoupons = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const addNotification = useAddNotification();

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => {
      const newCoupons = addCouponToList(prev, newCoupon);

      if (newCoupons === prev) {
        addNotification("이미 존재하는 쿠폰 코드입니다", "error");
      } else {
        addNotification("쿠폰이 추가되었습니다", "success");
      }
      return newCoupons;
    });
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => {
      const newCoupons = deleteCouponToList(prev, couponCode);
      const wasDeleted = newCoupons.length < prev.length;

      if (wasDeleted) {
        addNotification("쿠폰이 삭제되었습니다", "success");
      }

      return newCoupons;
    });
  };

  return { coupons, addCoupon, deleteCoupon };
};
