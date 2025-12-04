import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants";
import { useNotificationStore } from "./notificationStore";

type ProductState = {
  products: ProductWithUI[];
};

type ProductActions = {
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  setProducts: (products: ProductWithUI[]) => void;
  reset: () => void;
};

export type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>()(
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

        useNotificationStore.getState().addNotification("상품이 추가되었습니다.", "success");
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        }));

        useNotificationStore.getState().addNotification("상품이 수정되었습니다.", "success");
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));

        useNotificationStore.getState().addNotification("상품이 삭제되었습니다.", "success");
      },

      setProducts: (products) => {
        set({ products });
      },

      reset: () => {
        set({ products: initialProducts });
      },
    }),
    {
      name: "products", // localStorage key
    }
  )
);
