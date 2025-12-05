import { PersistStorage } from 'zustand/middleware';
import { CouponsContext } from '../stores/coupons';

export const couponsStorage: PersistStorage<{ context: CouponsContext }> = {
  getItem: (name: string) => {
    const stored = localStorage.getItem(name);
    if (!stored) return null;

    return JSON.parse(stored);
  },
  setItem: (name, value) => {
    const coupons = value.state.context.coupons;
    localStorage.setItem(name, JSON.stringify(coupons));
  },
  removeItem: name => {
    localStorage.removeItem(name);
  }
};
