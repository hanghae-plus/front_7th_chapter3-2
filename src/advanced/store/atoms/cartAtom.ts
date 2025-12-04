import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../../../types";
import { STORAGE_KEYS } from "../../constants";

// 기본 상태
export const cartAtom = atomWithStorage<CartItem[]>(STORAGE_KEYS.CART, []);

// 파생 상태: 총 아이템 개수
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// 파생 상태: 장바구니가 비어있는지 여부
export const isCartEmptyAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.length === 0;
});
