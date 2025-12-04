import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types";
import productModel from "../models/product";
interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
} // 초기 데이터

const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];
const useProducts = () => {
  const [_products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
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
    localStorage.setItem("products", JSON.stringify(_products));
  }, [_products]);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = { ...newProduct, id: `p${Date.now()}` };
    setProducts((prev) => productModel.addProduct(prev, product));
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts((prev) => productModel.updateProduct(prev, productId, updates));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => productModel.deleteProduct(prev, productId));
  }, []);

  const updateProductStock = useCallback((productId: string, newStock: number) => {
    setProducts((prev) => productModel.updateProductStock(prev, productId, newStock));
  }, []);

  return {
    data: _products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
  };
};

export default useProducts;
