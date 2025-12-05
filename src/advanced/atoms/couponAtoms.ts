import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Coupon } from '../../types';
import { initialCoupons } from '../constants';

/**
 * 쿠폰 목록 atom (localStorage 연동)
 */
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

/**
 * 선택된 쿠폰 atom
 */
export const selectedCouponAtom = atom<Coupon | null>(null);

/**
 * 쿠폰 적용 액션 atom
 */
export const applyCouponAtom = atom(null, (_get, set, coupon: Coupon) => {
  set(selectedCouponAtom, coupon);
});

/**
 * 쿠폰 해제 액션 atom
 */
export const removeCouponAtom = atom(null, (_get, set) => {
  set(selectedCouponAtom, null);
});

/**
 * 쿠폰 추가 액션 atom
 */
export const addCouponAtom = atom(null, (get, set, newCoupon: Coupon) => {
  const coupons = get(couponsAtom);
  set(couponsAtom, [...coupons, newCoupon]);
});

/**
 * 쿠폰 삭제 액션 atom
 */
export const deleteCouponAtom = atom(null, (get, set, code: string) => {
  const coupons = get(couponsAtom);
  const selectedCoupon = get(selectedCouponAtom);

  set(
    couponsAtom,
    coupons.filter(c => c.code !== code)
  );

  // 삭제된 쿠폰이 선택된 쿠폰이면 선택 해제
  if (selectedCoupon?.code === code) {
    set(selectedCouponAtom, null);
  }
});
