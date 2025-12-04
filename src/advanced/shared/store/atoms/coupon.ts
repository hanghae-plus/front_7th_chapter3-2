/**
 * Coupons Atom
 * - localStorage에 자동 동기화
 */
import { atomWithStorage } from 'jotai/utils';
import { Coupon } from '../../../entities/coupon/model';

export const couponsAtom = atomWithStorage<Coupon[]>(
  'coupons',
  []
);
