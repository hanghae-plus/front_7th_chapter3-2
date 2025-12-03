import { useState } from "react";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants";

export const useProducts = () => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (updates: Partial<ProductWithUI>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updates.id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return { products, addProduct, updateProduct, deleteProduct };
};
