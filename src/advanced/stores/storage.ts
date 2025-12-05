import { PersistStorage, StorageValue } from 'zustand/middleware';
import { CartItem } from '../../types';
import { ProductWithUI } from '../models/product';

// Cart용 커스텀 스토리지 - cart 배열만 직접 저장
export const cartStorage: PersistStorage<{ cart: CartItem[] }> = {
  getItem: (name: string): StorageValue<{ cart: CartItem[] }> | null => {
    const value = localStorage.getItem(name);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value);
      // 이미 Zustand 형식이면 그대로 반환
      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        return parsed as StorageValue<{ cart: CartItem[] }>;
      }
      // 기존 형식(배열)이면 Zustand 형식으로 변환
      if (Array.isArray(parsed)) {
        return { state: { cart: parsed }, version: 0 };
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<{ cart: CartItem[] }>): void => {
    try {
      // cart 배열만 직접 저장
      if (value && value.state && value.state.cart) {
        localStorage.setItem(name, JSON.stringify(value.state.cart));
      }
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

// Products용 커스텀 스토리지 - products 배열만 직접 저장
export const productsStorage: PersistStorage<{ products: ProductWithUI[] }> = {
  getItem: (
    name: string
  ): StorageValue<{ products: ProductWithUI[] }> | null => {
    const value = localStorage.getItem(name);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value);
      // 이미 Zustand 형식이면 그대로 반환
      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        return parsed as StorageValue<{ products: ProductWithUI[] }>;
      }
      // 기존 형식(배열)이면 Zustand 형식으로 변환
      if (Array.isArray(parsed)) {
        return { state: { products: parsed }, version: 0 };
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (
    name: string,
    value: StorageValue<{ products: ProductWithUI[] }>
  ): void => {
    try {
      // products 배열만 직접 저장
      if (value && value.state && value.state.products) {
        localStorage.setItem(name, JSON.stringify(value.state.products));
      }
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};
