import { atom } from "jotai";
import { CartItem, Coupon, Notification, Product } from "../../types";

// 장바구니
export const cartAtom = atom<CartItem[]>([]);
// 쿠폰 목록
export const couponsAtom = atom<Coupon[]>([]);
// 선택된 쿠폰
export const selectedCouponAtom = atom<Coupon | null>(null);
// 상품 목록
export const productsAtom = atom<Product[]>([]);

export const notificationAtom = atom<Notification | null>(null);
