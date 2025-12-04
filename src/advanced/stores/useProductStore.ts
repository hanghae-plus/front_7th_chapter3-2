import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductWithUI } from "../types/types";
import { INITIAL_PRODUCTS } from "../constants";
import { useNotificationStore } from "./useNotificationStore";

interface ProductStoreState {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      // 로컬 스토리지에 products 값이 있으면 그 값을, 아니면 INITIAL_PRODUCTS 사용
      products: INITIAL_PRODUCTS,

      addProduct: (newProduct) => {
        const product: ProductWithUI = {
          ...newProduct,
          id: `p${Date.now()}`,
        };
        set((state) => ({
          products: [...state.products, product],
        }));

        useNotificationStore
          .getState()
          .addNotification("상품이 추가되었습니다.", "success");
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        }));

        useNotificationStore
          .getState()
          .addNotification("상품이 수정되었습니다.", "success");
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));

        useNotificationStore
          .getState()
          .addNotification("상품이 삭제되었습니다.", "success");
      },
    }),
    {
      name: "products",
    }
  )
);
