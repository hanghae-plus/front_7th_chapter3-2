import { ProductWithUI } from './types';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { initialProducts } from './data';
import { useCallback } from 'react';

export const useProductList = () => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts,
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prevProducts) => [...prevProducts, product]);
    },
    [setProducts],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...updates,
              }
            : product,
        ),
      );
    },
    [setProducts],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId),
      );
    },
    [setProducts],
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
