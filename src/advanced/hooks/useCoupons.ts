import { Coupon } from "../../types";
import { initialCoupons } from "../constants/data";
import { atomWithStorage } from "jotai/utils";
import { atom, useAtom } from "jotai";

const atomCoupons = atomWithStorage<Coupon[]>("coupons", initialCoupons);
const atomSelectedCoupon = atom<Coupon | null>(null);

export const useCoupons = () => {
  const [coupons, setCoupons] = useAtom(atomCoupons);

  const [selectedCoupon, setSelectedCoupon] = useAtom(atomSelectedCoupon);

  return { coupons, setCoupons, selectedCoupon, setSelectedCoupon };
};
