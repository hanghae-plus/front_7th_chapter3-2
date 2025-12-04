/**
 * Shared Store - Jotai Atoms
 * 
 * 전역 상태 관리
 * - Jotai atom을 사용하여 Props drilling 제거
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem } from '../../entities/cart/model';
import { Coupon } from '../../entities/coupon/model';
import { ProductWithUI } from '../../pages/AdminPage';

/**
 * Toast Atom
 * - 토스트 메시지 상태 관리
 */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const toastsAtom = atom<Toast[]>([]);

/**
 * Products Atom
 * - localStorage에 자동 동기화
 */
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', []);

/**
 * Coupons Atom
 * - localStorage에 자동 동기화
 */
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', []);

/**
 * Cart Atom
 * - localStorage에 자동 동기화
 */
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

/**
 * Selected Coupon Atom
 * - 현재 선택된 쿠폰
 */
export const selectedCouponAtom = atom<Coupon | null>(null);
