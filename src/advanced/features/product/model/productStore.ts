import { create } from "zustand";
import { ProductWithUI } from "../../../entities/product/model/types";
import { useNotificationStore } from "../../../shared/lib/notificationStore";

interface ProductState {
  products: ProductWithUI[]; 
  setProducts: (products: ProductWithUI[]) => void;

  // ✅ [수정] 배열([])이 아니라 함수((...)=>void)여야 합니다!
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  addProduct: (product: Omit<ProductWithUI, "id">) => {
  const newProduct = { ...product, id: `p-${crypto.randomUUID()}` };
 set((state) => ({
      products: [...state.products, newProduct],
    }));
    
    useNotificationStore
      .getState()
      .addNotification("상품이 추가되었습니다.", "success");
  },

  updateProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, ...updates } : p
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
}));