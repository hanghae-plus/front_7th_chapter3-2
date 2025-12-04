/**
 * Toast Atom
 * - 토스트 메시지 상태 관리
 */
import { atom } from 'jotai';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const toastsAtom = atom<Toast[]>([]);
