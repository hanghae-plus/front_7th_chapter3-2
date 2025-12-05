import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { atom } from "jotai";

export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

export const selectedCouponAtom = atom<Coupon | null>(null);
