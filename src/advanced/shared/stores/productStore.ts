import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../../entities/product/model/types';
import { initialProducts } from '../../entities/product/model/data';
import { createProduct } from '../../entities/product/model/product';
import { STORAGE_KEYS } from '../config/storageKeys';

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts,

      addProduct: (newProduct) =>
        set((state) => ({
          products: [...state.products, createProduct(newProduct)],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: STORAGE_KEYS.PRODUCTS,
    },
  ),
);
