import { useAtom } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../atoms/coupons";
import { useNotification } from "./useNotification";
import { Coupon } from "../../types";
import { couponModel } from "../models/coupon";

export const useCoupons = () => {
  const { addNotification } = useNotification();
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  const isDuplicateCoupon = (newCoupon: Coupon) => {
    return coupons.find((c) => c.code === newCoupon.code) !== undefined;
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [...prev, newCoupon]);
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    // selectedCoupon도 atom이므로 직접 업데이트
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
  };

  const applyCoupon = (coupon: Coupon, currentTotal: number) => {
    const isApplicable = couponModel.isApplicable(currentTotal, coupon);

    if (!isApplicable) {
      addNotification(
        "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        "error"
      );
      return;
    }
    setSelectedCoupon(coupon);
    addNotification("쿠폰이 적용되었습니다.", "success");
  };

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    isDuplicateCoupon,
    applyCoupon,
  };
};
