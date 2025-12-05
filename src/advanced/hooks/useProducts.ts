import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types";
import productModel from "../models/product";
import { initialProducts } from "../constants";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
} // 초기 데이터

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
