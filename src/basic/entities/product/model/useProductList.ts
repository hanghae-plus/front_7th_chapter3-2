import { Product } from './types';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { initialProducts } from './data';
import { useCallback } from 'react';
import { createProduct } from './product';
import { STORAGE_KEYS } from '../../../shared/config/storageKeys';

export const useProductList = () => {
  const [products, setProducts] = useLocalStorage<Product[]>(
    STORAGE_KEYS.PRODUCTS,
    initialProducts,
  );

  const addProduct = useCallback(
    (newProduct: Omit<Product, 'id'>) => {
      const product = createProduct(newProduct);
      setProducts((prevProducts) => [...prevProducts, product]);
    },
    [setProducts],
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
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
