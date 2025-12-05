// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useAtom } from "jotai";
import { useCallback } from "react";
import { Coupon } from "../../types";
import { couponsAtom } from "../atoms";
import {
  addCouponToList,
  findCouponByCode,
  removeCouponFromList,
} from "../models/coupon";

export function useCoupons({
  onMessage,
  onDeleteSelectedCoupon,
}: {
  onMessage: (message: string, type: "error" | "success" | "warning") => void;
  onDeleteSelectedCoupon: (code: string) => void;
}) {
  const [coupons, setCoupons] = useAtom(couponsAtom);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = findCouponByCode(coupons, newCoupon.code);
      if (existingCoupon) {
        onMessage("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => addCouponToList(prev, newCoupon));
      onMessage("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, setCoupons, onMessage]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => removeCouponFromList(prev, couponCode));
      onDeleteSelectedCoupon(couponCode);
      onMessage("쿠폰이 삭제되었습니다.", "success");
    },
    [setCoupons, onDeleteSelectedCoupon, onMessage]
  );

  return {
    value: coupons,
    add: addCoupon,
    remove: deleteCoupon,
  };
}
