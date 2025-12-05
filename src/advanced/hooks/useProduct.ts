import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom
} from '../atoms';
import type { ProductWithUI } from '../constants';

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
 * 상품 관리 훅 (Jotai adapter)
 *
 * 기존 인터페이스를 유지하면서 내부적으로 Jotai atom 사용
 *
 * @returns 상품 목록과 CRUD 액션들
 */
export const useProduct = (): UseProductReturn => {
  const products = useAtomValue(productsAtom);
  const addProductAction = useSetAtom(addProductAtom);
  const updateProductAction = useSetAtom(updateProductAtom);
  const deleteProductAction = useSetAtom(deleteProductAtom);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProductAction(newProduct);
    },
    [addProductAction]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProductAction({ productId, updates });
    },
    [updateProductAction]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      deleteProductAction(productId);
    },
    [deleteProductAction]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
