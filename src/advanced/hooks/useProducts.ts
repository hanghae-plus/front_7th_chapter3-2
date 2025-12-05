import { useState, useCallback, useEffect } from 'react';
import { ProductWithUI } from '../model/productModels';
import { initialProducts } from '../constant/product';
import { addProduct as addProductManager, updateProduct as updateProductManager, deleteProduct as deleteProductManager } from '../entities/product/lib/productManager';

type AddNotification = (message: string, type?: 'error' | 'success' | 'warning') => void;

export const useProducts = (addNotification: AddNotification) => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const { newProducts } = addProductManager(products, newProduct);
    setProducts(newProducts);
    addNotification('상품이 추가되었습니다.', 'success');
  }, [products, addNotification]);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    const { newProducts } = updateProductManager(products, productId, updates);
    setProducts(newProducts);
    addNotification('상품이 수정되었습니다.', 'success');
  }, [products, addNotification]);

  const deleteProduct = useCallback((productId: string) => {
    const { newProducts } = deleteProductManager(products, productId);
    setProducts(newProducts);
    addNotification('상품이 삭제되었습니다.', 'success');
  }, [products, addNotification]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};