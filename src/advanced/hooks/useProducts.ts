export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

import { Product } from "../../types";
import { useAtom, useAtomValue } from "jotai";
import { productsAtom } from "../atoms/products";

export function useProducts() {
  const [products, setProducts] = useAtom(productsAtom);

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const filterProductsBySearchTerm = (searchTerm: string) => {
    const products = useAtomValue(productsAtom);

    if (!searchTerm.trim()) {
      return products;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        (product.description &&
          product.description.toLowerCase().includes(lowerSearchTerm))
    );
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProductsBySearchTerm,
  };
}
