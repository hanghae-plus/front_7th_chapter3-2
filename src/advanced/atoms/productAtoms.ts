import { atom } from 'jotai';
import { ProductWithUI, initialProducts } from '../constants';
import { filterProducts } from '../models/product';

// localStorage에서 초기값 로드
const loadProductsFromStorage = (): ProductWithUI[] => {
  const saved = localStorage.getItem('products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
};

// 기본 Atoms
export const productsAtom = atom<ProductWithUI[]>(loadProductsFromStorage());

// localStorage 동기화를 위한 atom
export const productsWithStorageAtom = atom(
  (get) => get(productsAtom),
  (get, set, newProducts: ProductWithUI[]) => {
    set(productsAtom, newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  }
);

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
    set(productsWithStorageAtom, newProducts);
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
    set(productsWithStorageAtom, newProducts);
  }
);

export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    const products = get(productsAtom);
    const newProducts = products.filter(p => p.id !== productId);
    set(productsWithStorageAtom, newProducts);
  }
);

