/**
 * Cart Atom
 * - localStorage에 자동 동기화
 */
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem } from '../../../entities/cart/model';
import { Coupon } from '../../../entities/coupon/model';

export const cartAtom = atomWithStorage<CartItem[]>(
  'cart',
  []
);

/**
 * Selected Coupon Atom
 * - 현재 선택된 쿠폰
 */
export const selectedCouponAtom = atom<Coupon | null>(null);
