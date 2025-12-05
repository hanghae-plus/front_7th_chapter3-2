import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { initialProducts, type ProductWithUI } from '../constants';

// Re-export ProductWithUI for external use
export type { ProductWithUI } from '../constants';

/**
 * useProduct 훅 반환 타입
 */
export interface UseProductReturn {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

/**
 * 상품 관리 훅
 *
 * @returns 상품 목록과 CRUD 액션들
 */
export const useProduct = (): UseProductReturn => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`
      };
      setProducts(prev => [...prev, product]);
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
    },
    [setProducts]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
