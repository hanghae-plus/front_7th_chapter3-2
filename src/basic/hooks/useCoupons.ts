import { useCallback, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { addCouponToList, deleteCouponToList } from "../models/coupon";

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

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupons((prev) => {
      const newCoupons = addCouponToList(prev, newCoupon);

      if (newCoupons === prev) {
        alert("이미 존재하는 쿠폰 코드입니다.");
      } else {
        alert("쿠폰이 추가되었습니다.");
      }
      return newCoupons;
    });
  }, []);

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => {
        const newCoupons = deleteCouponToList(prev, couponCode);

        // 삭제 성공 여부 확인
        const wasDeleted = newCoupons.length < prev.length;

        if (wasDeleted) {
          // 선택된 쿠폰이 삭제된 쿠폰이면 해제
          if (selectedCoupon?.code === couponCode) {
            setSelectedCoupon(null);
          }
          alert("쿠폰이 삭제되었습니다.");
        }

        return newCoupons;
      });
    },
    [selectedCoupon]
  );
  
  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    addCoupon,
    deleteCoupon,
  };
};
