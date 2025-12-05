import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProducts } from '../constants/products';
import { productsStorage } from '../storage/products';
import { ProductWithUI } from '../types/products';
import { useNotifications } from './notifications';

export interface ProductsContext {
  products: ProductWithUI[];
}

interface ProductsActions {
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  clearProducts: () => void;
}

interface ProductsStore {
  context: ProductsContext;
  actions: ProductsActions;
}

const initialContext: ProductsContext = {
  products: initialProducts
};

export const useProducts = create<ProductsStore>()(
  persist(
    set => ({
      context: {
        ...initialContext
      },
      actions: {
        addProduct: newProduct => {
          const { addNotification } = useNotifications.getState().actions;

          set(({ context }) => ({
            context: {
              products: [
                ...context.products,
                {
                  ...newProduct,
                  id: `p${Date.now()}`
                }
              ]
            }
          }));

          addNotification('상품이 추가되었습니다.', 'success');
        },
        updateProduct: (productId, updates) => {
          const { addNotification } = useNotifications.getState().actions;

          set(({ context }) => ({
            context: {
              products: context.products.map(product => (product.id === productId ? { ...product, ...updates } : product))
            }
          }));

          addNotification('상품이 수정되었습니다.', 'success');
        },
        deleteProduct: productId => {
          const { addNotification } = useNotifications.getState().actions;

          set(({ context }) => ({
            context: {
              products: context.products.filter(p => p.id !== productId)
            }
          }));

          addNotification('상품이 삭제되었습니다.', 'success');
        },
        clearProducts: () => {
          set({ context: { ...initialContext } });
        }
      }
    }),
    {
      name: 'products',
      storage: productsStorage,
      partialize: ({ context }) => ({ context })
    }
  )
);

export const productsContext = () => useProducts(({ context }) => context);
export const productsActions = () => useProducts(({ actions }) => actions);
