import { useCallback } from "react";
import {
  ProductWithUI,
  INITIAL_PRODUCTS,
  STORAGE_KEYS,
  MESSAGES,
} from "../constants";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface UseProductsParams {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const useProducts = ({ addNotification }: UseProductsParams) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    STORAGE_KEYS.PRODUCTS,
    INITIAL_PRODUCTS
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification(MESSAGES.PRODUCT_ADDED, "success");

      return product;
    },
    [addNotification, setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification(MESSAGES.PRODUCT_UPDATED, "success");
    },
    [addNotification, setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification(MESSAGES.PRODUCT_DELETED, "success");
    },
    [addNotification, setProducts]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
