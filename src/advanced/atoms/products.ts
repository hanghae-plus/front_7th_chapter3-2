import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../hooks/useProducts";
import { initialProducts } from "../constants";

export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
