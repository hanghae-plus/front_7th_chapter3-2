import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../../types";
import { initialCoupons } from "../constant";

// 쿠폰 관련 Atoms
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
