import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { initialProducts, type ProductWithUI } from '../constants';

/**
 * 상품 목록 atom (localStorage 연동)
 */
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  'products',
  initialProducts
);

/**
 * 상품 추가 액션 atom
 */
export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    const products = get(productsAtom);
    set(productsAtom, [...products, product]);
  }
);

/**
 * 상품 수정 액션 atom
 */
export const updateProductAtom = atom(
  null,
  (get, set, { productId, updates }: { productId: string; updates: Partial<ProductWithUI> }) => {
    const products = get(productsAtom);
    set(
      productsAtom,
      products.map(product =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  }
);

/**
 * 상품 삭제 액션 atom
 */
export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const products = get(productsAtom);
  set(
    productsAtom,
    products.filter(p => p.id !== productId)
  );
});
