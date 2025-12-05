import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Coupon } from "../../types";
import { calculateCartTotal } from "../models/cart";

// 장바구니 관련 Atoms
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);
export const selectedCouponAtom = atom<Coupon | null>(null);

// Derived Atoms
export const cartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const cartTotalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});
