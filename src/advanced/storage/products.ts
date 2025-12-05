import { PersistStorage } from 'zustand/middleware';
import { ProductsContext } from '../stores/products';

export const productsStorage: PersistStorage<{ context: ProductsContext }> = {
  getItem: (name: string) => {
    const stored = localStorage.getItem(name);
    if (!stored) return null;

    return JSON.parse(stored);
  },
  setItem: (name, value) => {
    const products = value.state.context.products;
    localStorage.setItem(name, JSON.stringify(products));
  },
  removeItem: name => {
    localStorage.removeItem(name);
  }
};
