import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../types";
import { initialCoupons } from "../constants";
import { calculateCartTotal } from "../models/calculateCartTotal";
import { cartAtom } from "./cart";

// 기본 상태 atoms
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);

// Actions
export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const coupons = get(couponsAtom);
  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  if (existingCoupon) {
    // Toast는 컴포넌트에서 처리
    return;
  }
  set(couponsAtom, [...coupons, newCoupon]);
});

export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  const coupons = get(couponsAtom);
  const selectedCoupon = get(selectedCouponAtom);
  set(couponsAtom, coupons.filter((c) => c.code !== couponCode));
  if (selectedCoupon?.code === couponCode) {
    set(selectedCouponAtom, null);
  }
});

export const applyCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  const currentTotal = calculateCartTotal(
    cart,
    selectedCoupon
  ).totalAfterDiscount;

  if (currentTotal < 10000 && coupon.discountType === "percentage") {
    // Toast는 컴포넌트에서 처리
    return;
  }

  set(selectedCouponAtom, coupon);
});

