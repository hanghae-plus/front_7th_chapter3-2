import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "../../utils/toast";
import { isCouponCodeExists, addCoupon, deleteCoupon } from "../../models/coupon";
import type { Coupon } from "../../../types";

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

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);

export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const coupons = get(couponsAtom);

  if (isCouponCodeExists(coupons, newCoupon.code)) {
    toast.error("이미 존재하는 쿠폰 코드입니다.");
    return;
  }

  set(couponsAtom, addCoupon(coupons, newCoupon));
  toast.success("쿠폰이 추가되었습니다.");
});

export const deleteCouponAtom = atom(null, (get, set, couponCode: string) => {
  const selectedCoupon = get(selectedCouponAtom);

  set(couponsAtom, deleteCoupon(get(couponsAtom), couponCode));

  if (selectedCoupon?.code === couponCode) {
    set(selectedCouponAtom, null);
  }

  toast.success("쿠폰이 삭제되었습니다.");
});

// applyCoupon
