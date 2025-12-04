import { useState, useEffect } from "react";
import {
  ProductWithUI,
  INITIAL_PRODUCTS,
  STORAGE_KEYS,
} from "../../../lib/constants";

export function useProducts() {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  return {
    products,
    setProducts,
  };
}
