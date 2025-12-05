import { useCallback } from "react";
import { Product } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialProducts } from "../constants";

export function useProducts(
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void
) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);

  // 새 상품 추가
  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    const product = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
    addNotification('상품이 추가되었습니다.', 'success');
  }, [setProducts, addNotification]);

  // 상품 정보 수정
  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
        ? {...p, ...updates}
        : p
    ));
    addNotification('상품이 수정되었습니다.', 'success');
  }, [setProducts, addNotification]);

  // 상품 삭제
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p =>
      p.id !== productId
    ));
    addNotification('상품이 삭제되었습니다.', 'success');
  }, [setProducts, addNotification]);

  // 재고 수정
  const updateProductStock = useCallback((productId:string, newStock: number) => {
    updateProduct(productId, { stock: newStock });
  }, [updateProduct]);

  // 할인 규칙 추가
  const addProductDiscount = useCallback((
    productId: string,
    discount: {
      quantity: number,
      rate: number
    }
  ) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
      ? {...p, discounts: [...p.discounts, discount]}
      : p
    ));
  }, [setProducts]);

  // 할인 규칙 삭제
  const removeProductDiscount = useCallback((productId: string, discountIndex: number) => {
    setProducts(prev => prev.map(p =>
      p.id === productId
      ? {...p, discounts: p.discounts.filter((_d, idx) => idx !== discountIndex)}
      : p
    ));
  }, [setProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  }
}
