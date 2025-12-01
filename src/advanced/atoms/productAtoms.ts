import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI, initialProducts } from '../constants';
import { filterProducts } from '../models/product';

// localStorage와 자동 동기화되는 atom
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);

export const searchTermAtom = atom<string>('');

// Derived Atoms
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  return filterProducts(products, searchTerm);
});

// Write-only Atoms (액션)
export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, 'id'>) => {
    const products = get(productsAtom);
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    const newProducts = [...products, product];
    set(productsAtom, newProducts);
  }
);

export const updateProductAtom = atom(
  null,
  (get, set, productId: string, updates: Partial<ProductWithUI>) => {
    const products = get(productsAtom);
    const newProducts = products.map(product =>
      product.id === productId
        ? { ...product, ...updates }
        : product
    );
    set(productsAtom, newProducts);
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    const products = get(productsAtom);
    const newProducts = products.filter(p => p.id !== productId);
    set(productsAtom, newProducts);
  }
);

