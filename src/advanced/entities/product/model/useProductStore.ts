import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductWithUI, initialProducts } from '../../../shared/config';

export type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

const initialProductForm: ProductFormData = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};

interface ProductState {
  // 상태
  products: ProductWithUI[];
  editingProduct: string | null;
  showProductForm: boolean;
  productForm: ProductFormData;

  // 액션
  setEditingProduct: (id: string | null) => void;
  setShowProductForm: (show: boolean) => void;
  setProductForm: (form: ProductFormData) => void;
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  startEditProduct: (product: ProductWithUI) => void;
  resetForm: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      // 초기 상태
      products: initialProducts,
      editingProduct: null,
      showProductForm: false,
      productForm: initialProductForm,

      // 액션
      setEditingProduct: (id) => set({ editingProduct: id }),
      setShowProductForm: (show) => set({ showProductForm: show }),
      setProductForm: (form) => set({ productForm: form }),

      addProduct: (newProduct) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...newProduct, id: `p${Date.now()}` },
          ],
        })),

      updateProduct: (productId, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        })),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),

      startEditProduct: (product) =>
        set({
          editingProduct: product.id,
          productForm: {
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description || '',
            discounts: product.discounts || [],
          },
          showProductForm: true,
        }),

      resetForm: () =>
        set({
          productForm: initialProductForm,
          editingProduct: null,
          showProductForm: false,
        }),
    }),
    {
      name: 'products',
      partialize: (state) => ({ products: state.products }),
    }
  )
);

// 테스트용 리셋 함수
export const resetProductStore = () => {
  useProductStore.setState({
    products: initialProducts,
    editingProduct: null,
    showProductForm: false,
    productForm: initialProductForm,
  });
};
