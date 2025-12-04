/**
 * Products Atom
 * - localStorage에 자동 동기화
 */
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../../../pages/AdminPage';

export const productsAtom = atomWithStorage<ProductWithUI[]>(
  'products',
  []
);
