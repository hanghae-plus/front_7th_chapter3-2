import { useState } from "react";
import { initialProducts } from "../constants";

export const useProducts = () => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  return { products, setProducts };
};
