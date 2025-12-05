import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Discount } from '../../types';
import { ProductWithUI } from '../models/product';
import { initialProducts, STORAGE_KEYS } from '../constants';
import { productsStorage } from './storage';

interface ProductState {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;
  addProductDiscount: (productId: string, discount: Discount) => void;
  removeProductDiscount: (productId: string, discountIndex: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,

      addProduct: (newProduct) => {
        const product: ProductWithUI = {
          ...newProduct,
          id: `p${Date.now()}`,
        };
        set((state) => ({
          products: [...state.products, product],
        }));
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        }));
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      updateProductStock: (productId, stock) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, stock } : product
          ),
        }));
      },

      addProductDiscount: (productId, discount) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, discounts: [...product.discounts, discount] }
              : product
          ),
        }));
      },

      removeProductDiscount: (productId, discountIndex) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  discounts: product.discounts.filter(
                    (_, index) => index !== discountIndex
                  ),
                }
              : product
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.PRODUCTS,
      storage: productsStorage,
      partialize: (state) => ({ products: state.products }),
    }
  )
);
