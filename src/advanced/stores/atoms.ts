import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Coupon, Notification, ProductWithUI } from "../../types";
import { initialCoupons, initialProducts } from "../constants";

// 장바구니 (localStorage 저장)
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

// 상품 목록 (localStorage 저장)
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);

// 쿠폰 목록 (localStorage 저장)
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

// 선택된 쿠폰 (세션 중에만 유지)
export const selectedCouponAtom = atom<Coupon | null>(null);

// 알림 목록 (세션 중에만 유지)
export const notificationsAtom = atom<Notification[]>([]);
