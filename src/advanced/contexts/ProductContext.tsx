import { createContext, useContext, ReactNode } from "react";
import { useProducts } from "../hooks/useProducts";
import { initialProducts } from "../constants";

type ProductContextType = ReturnType<typeof useProducts>;

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const productState = useProducts(initialProducts);

  return <ProductContext.Provider value={productState}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
};
