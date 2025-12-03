import { useCallback, useState } from "react";
import { Product } from "../../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  // 새 상품 추가
  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    const product = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts([...products, product]);
  }, [products]);

  // 상품 정보 수정
  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(products.map(p =>
      p.id === productId
        ? {...p, ...updates}
        : p
    ));
  }, [products]);

  // 상품 삭제
  const deleteProduct = useCallback((productId: string) => {
    setProducts(products.filter(p =>
      p.id !== productId
    ));
  }, [products]);

  // 재고 수정
  const updateProductStock = useCallback((productId:string, newStock: number) => {
    updateProduct(productId, { stock: newStock });
  }, [products]);

  // 할인 규칙 추가
  const addProductDiscount = useCallback((
    productId: string,
    discount: {
      quantity: number,
      rate: number
    }
  ) => {
    setProducts(products.map(p =>
      p.id === productId
      ? {...p, discount: [...p.discounts, discount]}
      : p
    ));
  }, [products]);

  // 할인 규칙 삭제
  const removeProductDiscount = useCallback((productId: string, discountIndex: number) => {
    setProducts(products.map(p =>
      p.id === productId
      ? {...p, discount: p.discounts.filter((d, idx) => idx !== discountIndex)}
      : p
    ));
  }, [products]);

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  }
}