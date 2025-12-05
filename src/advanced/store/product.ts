import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../types";
import { initialProducts } from "../constants";

// 기본 상태 atoms
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);

// Actions
export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, "id">) => {
    const products = get(productsAtom);
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    set(productsAtom, [...products, product]);
  }
);

export const updateProductAtom = atom(
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    const products = get(productsAtom);
    set(
      productsAtom,
      products.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  }
);

export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const products = get(productsAtom);
  set(
    productsAtom,
    products.filter((p) => p.id !== productId)
  );
});
