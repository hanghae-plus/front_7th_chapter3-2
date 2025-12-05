import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { CartItem, Product } from '../../types';
import { selectedCouponAtom } from './couponAtoms';
import {
  calculateCartTotal,
  calculateItemTotal,
  updateCartItemQuantity,
  getRemainingStock as calcRemainingStock,
  addItemToCart,
  removeItemFromCart,
  type CartTotal
} from '../models';

/**
 * 장바구니 atom (localStorage 연동)
 */
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

/**
 * 장바구니 총액 파생 atom
 */
export const cartTotalAtom = atom<CartTotal>(get => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

/**
 * 장바구니 아이템 추가 액션 atom
 */
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const cart = get(cartAtom);
  const remainingStock = calcRemainingStock(product, cart);

  if (remainingStock <= 0) {
    return false;
  }

  set(cartAtom, addItemToCart(cart, product));
  return true;
});

/**
 * 장바구니 아이템 삭제 액션 atom
 */
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const cart = get(cartAtom);
  set(cartAtom, removeItemFromCart(cart, productId));
});

/**
 * 장바구니 수량 업데이트 액션 atom
 */
export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, newQuantity }: { productId: string; newQuantity: number }) => {
    const cart = get(cartAtom);
    set(cartAtom, updateCartItemQuantity(cart, productId, newQuantity));
  }
);

/**
 * 장바구니 비우기 액션 atom
 */
export const clearCartAtom = atom(null, (_get, set) => {
  set(cartAtom, []);
});

/**
 * 남은 재고 계산 함수 (atom이 아닌 유틸리티)
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  return calcRemainingStock(product, cart);
};

/**
 * 아이템 총액 계산 함수 (atom이 아닌 유틸리티)
 */
export const getItemTotal = (item: CartItem, cart: CartItem[]): number => {
  return calculateItemTotal(item, cart);
};
