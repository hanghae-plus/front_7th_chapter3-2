/**
 * Product Feature - useProduct Hook
 * 
 * 상품 상태 관리 및 CRUD 로직
 */

import { useCallback } from 'react';
import { ProductWithUI } from '../pages/AdminPage';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

interface UseProductProps {
  initialProducts: ProductWithUI[];
  onNotify: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export const useProduct = ({ initialProducts, onNotify }: UseProductProps) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  // 상품 추가
  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
    onNotify('상품이 추가되었습니다.', 'success');
  }, [onNotify, setProducts]);

  // 상품 수정
  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    onNotify('상품이 수정되었습니다.', 'success');
  }, [onNotify, setProducts]);

  // 상품 삭제
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    onNotify('상품이 삭제되었습니다.', 'success');
  }, [onNotify, setProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
