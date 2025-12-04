/**
 * Product Feature - useProduct Hook
 * 
 * 상품 상태 관리 및 CRUD 로직
 */
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { ProductWithUI } from '../pages/AdminPage';
import { productsAtom } from '../shared/store/atoms';
import { useToast } from '../shared/hooks/useToast';

export const useProduct = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const { addToast } = useToast();

  // 상품 추가
  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
    addToast('상품이 추가되었습니다.', 'success');
  }, [addToast, setProducts]);

  // 상품 수정
  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    addToast('상품이 수정되었습니다.', 'success');
  }, [addToast, setProducts]);

  // 상품 삭제
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addToast('상품이 삭제되었습니다.', 'success');
  }, [addToast, setProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
