import { useState, useEffect } from "react";
import { SEARCH_DEBOUNCE_DELAY } from "../../../lib/constants";
import { useStore } from "../../../shared/stores/store";

export function useProductSearch() {
  const products = useStore((state) => state.products);
  const searchTerm = useStore((state) => state.searchTerm);
  const setSearchTerm = useStore((state) => state.setSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  };
}
