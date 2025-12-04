/**
 * UI State Atoms
 */
import { atom } from 'jotai';

export const isAdminAtom = atom<boolean>(false);
export const searchTermAtom = atom<string>('');
