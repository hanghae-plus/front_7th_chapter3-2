import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, ProductWithUI } from "../types";
import { calculateRemainingStock } from "../models/calculateRemainingStock";

// 기본 상태 atoms
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

// Derived atoms
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// Actions
export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const cart = get(cartAtom);
  const remainingStock = calculateRemainingStock(product, cart);

  if (remainingStock <= 0) {
    // Toast는 컴포넌트에서 처리
    return;
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      // Toast는 컴포넌트에서 처리
      return;
    }

    set(
      cartAtom,
      cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  } else {
    set(cartAtom, [...cart, { product, quantity: 1 }]);
  }
});

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const cart = get(cartAtom);
  set(
    cartAtom,
    cart.filter((item) => item.product.id !== productId)
  );
});

export const updateQuantityAtom = atom(
  null,
  (get, set, product: ProductWithUI, newQuantity: number) => {
    const cart = get(cartAtom);

    if (newQuantity <= 0) {
      set(
        cartAtom,
        cart.filter((item) => item.product.id !== product.id)
      );
      return;
    }

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      // Toast는 컴포넌트에서 처리
      return;
    }

    set(
      cartAtom,
      cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }
);

