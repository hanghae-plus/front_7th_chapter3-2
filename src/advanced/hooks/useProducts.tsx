import { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import { ProductWithUI } from "../../types";
import productModel from "../models/product";
import { initialProducts } from "../constants";
import { useContext } from "react";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export interface ProductContextType {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
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
  useLocalStorage("products", products);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

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

  const value: ProductContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return context;
};

export default useProducts;
