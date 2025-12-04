import { useCallback, useState } from "react";
import { ProductWithUI } from "../types";
import { initialProducts } from "../constants";
import { useDebounce } from "../utils/hooks/useDebounce";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useProduct = ({
  onSuccess,
}: {
  onSuccess: (message: string) => void;
}) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      onSuccess("상품이 추가되었습니다.");
    },
    [onSuccess, setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      onSuccess("상품이 수정되었습니다.");
    },
    [onSuccess, setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      onSuccess("상품이 삭제되었습니다.");
    },
    [onSuccess, setProducts]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  };
};
