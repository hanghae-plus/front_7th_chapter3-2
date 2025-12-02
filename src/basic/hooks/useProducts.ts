import { useState, useCallback, useEffect } from "react";
import { Product } from "../../types";
import { initialProducts } from "../constants";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
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

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    []
  );

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
