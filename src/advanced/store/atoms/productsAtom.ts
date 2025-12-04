import { atomWithStorage } from "jotai/utils";
import { ProductWithUI, STORAGE_KEYS, INITIAL_PRODUCTS } from "../../constants";

// 기본 상태
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  STORAGE_KEYS.PRODUCTS,
  INITIAL_PRODUCTS
);
