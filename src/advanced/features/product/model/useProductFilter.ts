import { useState } from "react";
import { ProductWithUI } from "../../../entities/product/model/types";
import { useDebounce } from "../../../shared/lib/useDebounce";

export const useProductFilter = (products: ProductWithUI[]) => {
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

  return { searchTerm, setSearchTerm, filteredProducts };
};