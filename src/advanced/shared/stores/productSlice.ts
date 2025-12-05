import { StateCreator } from "zustand";
import {
  ProductWithUI,
  INITIAL_PRODUCTS,
  STORAGE_KEYS,
} from "../../lib/constants";

export interface ProductSlice {
  products: ProductWithUI[];
  searchTerm: string;
  setProducts: (
    products: ProductWithUI[] | ((prev: ProductWithUI[]) => ProductWithUI[])
  ) => void;
  setSearchTerm: (term: string) => void;
}

export const createProductSlice: StateCreator<
  ProductSlice,
  [],
  [],
  ProductSlice
> = (set) => ({
  products: (() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  })(),
  searchTerm: "",
  setProducts: (productsOrUpdater) => {
    set((state) => {
      const newProducts =
        typeof productsOrUpdater === "function"
          ? productsOrUpdater(state.products)
          : productsOrUpdater;

      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
      return { products: newProducts };
    });
  },
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },
});
