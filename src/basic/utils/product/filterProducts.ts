import { ProductWithUI } from "../../types/types";

export const filterProducts = (
  products: ProductWithUI[],
  debouncedSearchTerm: string
) => {
  if (debouncedSearchTerm) {
    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()))
    );
  } else {
    return products;
  }
};
