import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../constant";
import { filterProductsBySearchTerm } from "../models/product";

// 상품 관련 Atoms
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);

// UI Atoms (검색어)
export const searchTermAtom = atom("");

// Derived Atoms
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  return filterProductsBySearchTerm(products, searchTerm);
});
