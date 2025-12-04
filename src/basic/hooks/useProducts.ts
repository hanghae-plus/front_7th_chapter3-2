import { useCallback } from 'react';
import { ProductWithUI, initialProducts } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

/**
 * 상품 관리 Hook
 * 상품 목록 상태 관리 및 CRUD 작업 제공
 */
export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
    return product;
  }, [setProducts]);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
  }, [setProducts]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, [setProducts]);

  const updateProductStock = useCallback((productId: string, stock: number) => {
    updateProduct(productId, { stock });
  }, [updateProduct]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock
  };
}
