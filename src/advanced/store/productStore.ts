import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductWithUI } from '../../types';
import { initialProducts } from '../constants';

interface ProductState {
  products: ProductWithUI[];

  // 메서드
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, product: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addProductDiscount: (productId: string,
                        discount: {
                          quantity: number,
                          rate: number
                        }) => void;
  removeProductDiscount: (productId: string, discountIndex: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,

  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: `p${Date.now()}` }]
  })),

  updateProduct: (productId, updates) => set((state) => ({
    products: state.products.map(p =>
      p.id === productId
        ? { ...p, ...updates }
        : p
    )
  })),

  deleteProduct: (productId) => set((state) => ({
    products: state.products.filter(p => p.id !== productId)
  })),

  updateProductStock: (productId, newStock) => set((state) => ({
    products: state.products.map(p =>
      p.id === productId
        ? { ...p, stock: newStock }
        : p
    )
  })),

  addProductDiscount: (productId, discount) => set((state) => ({
    products: state.products.map(p =>
      p.id === productId
        ? { ...p, discounts: [...p.discounts, discount] }
        : p
    )
  })),

  removeProductDiscount: (productId, discountIndex) => set((state) => ({
    products: state.products.map(p =>
      p.id === productId
        ? { ...p, discounts: p.discounts.filter((_, idx) => idx !== discountIndex) }
        : p
    )
  })),
    }),
    {
      name: 'products',
      // products 배열만 localStorage에 저장 (Basic 버전과 동일하게)
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          // 배열 형식으로 저장/로드
          const data = JSON.parse(str);
          return Array.isArray(data) ? data : data.products || [];
        },
        setItem: (name, value) => {
          // products 배열만 저장
          localStorage.setItem(name, JSON.stringify(value.state.products));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)