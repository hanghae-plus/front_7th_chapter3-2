import { useCallback } from "react";
import { useAtom } from "jotai";
import { productsAtom } from "../store/atoms/productsAtom";
import { ProductWithUI, MESSAGES } from "../constants";
import { useNotification } from "./useNotification";

export const useProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const { addNotification } = useNotification();

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
    [setProducts, addNotification]
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
    [setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification(MESSAGES.PRODUCT_DELETED, "success");
    },
    [setProducts, addNotification]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
