// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useCallback } from "react";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { toast } from "../utils/toast";
import type { Coupon } from "../../types";

export function useCoupons(
  selectedCoupon: Coupon | null,
  setSelectedCoupon: (coupon: Coupon | null) => void
) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>("coupons", initialCoupons);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        toast.error("이미 존재하는 쿠폰 코드입니다.");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      toast.success("쿠폰이 추가되었습니다.");
    },
    [coupons, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      toast.success("쿠폰이 삭제되었습니다.");
    },
    [selectedCoupon, setSelectedCoupon, setCoupons]
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];
