import { PersistStorage } from 'zustand/middleware';
import { CartContext } from '../stores/cart';

export const cartStorage: PersistStorage<{ context: CartContext }> = {
  getItem: name => {
    const stored = localStorage.getItem(name);
    if (!stored) return null;

    return JSON.parse(stored);
  },
  setItem: (name, value) => {
    const cart = value.state.context.cart;
    localStorage.setItem(name, JSON.stringify(cart));
  },
  removeItem: name => {
    localStorage.removeItem(name);
  }
};
