import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { productsAtom } from '../store/atoms';
import { ProductWithUI } from '../../types';

export const useProductActions = () => {
  const setProducts = useSetAtom(productsAtom);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts(prev => [...prev, product]);
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev =>
        prev.map(product => (product.id === productId ? { ...product, ...updates } : product))
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
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
