import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../../types";
import { STORAGE_KEYS, INITIAL_COUPONS } from "../../constants";

// 기본 상태: 쿠폰 목록
export const couponsAtom = atomWithStorage<Coupon[]>(
  STORAGE_KEYS.COUPONS,
  INITIAL_COUPONS
);

// 기본 상태: 선택된 쿠폰
export const selectedCouponAtom = atomWithStorage<Coupon | null>(
  STORAGE_KEYS.SELECTED_COUPON,
  null
);

// 파생 상태: 쿠폰 개수
export const couponCountAtom = atom((get) => {
  const coupons = get(couponsAtom);
  return coupons.length;
});
