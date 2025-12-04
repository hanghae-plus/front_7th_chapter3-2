import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Product, Discount } from '../../types';

// Product 상태 - localStorage에서 읽거나 빈 배열로 시작
export const productsAtom = atomWithStorage<Product[]>('products', []);

// 상품 추가
export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<Product, 'id'>) => {
    const products = get(productsAtom);
    const product: Product = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    set(productsAtom, [...products, product]);
    return { success: true, message: '상품이 추가되었습니다.' };
  }
);

// 상품 수정
export const updateProductAtom = atom(
  null,
  (get, set, { productId, updates }: { productId: string; updates: Partial<Product> }) => {
    const products = get(productsAtom);
    set(productsAtom, products.map(product =>
      product.id === productId
        ? { ...product, ...updates }
        : product
    ));
    return { success: true, message: '상품이 수정되었습니다.' };
  }
);

// 상품 삭제
export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    const products = get(productsAtom);
    set(productsAtom, products.filter(p => p.id !== productId));
    return { success: true, message: '상품이 삭제되었습니다.' };
  }
);

// 재고 수정
export const updateProductStockAtom = atom(
  null,
  (get, set, { productId, stock }: { productId: string; stock: number }) => {
    const products = get(productsAtom);
    set(productsAtom, products.map(product =>
      product.id === productId
        ? { ...product, stock }
        : product
    ));
    return { success: true, message: '재고가 수정되었습니다.' };
  }
);

// 할인 규칙 추가
export const addProductDiscountAtom = atom(
  null,
  (get, set, { productId, discount }: { productId: string; discount: Discount }) => {
    const products = get(productsAtom);
    set(productsAtom, products.map(product =>
      product.id === productId
        ? { ...product, discounts: [...product.discounts, discount] }
        : product
    ));
    return { success: true, message: '할인 규칙이 추가되었습니다.' };
  }
);

// 할인 규칙 삭제
export const removeProductDiscountAtom = atom(
  null,
  (get, set, { productId, discountIndex }: { productId: string; discountIndex: number }) => {
    const products = get(productsAtom);
    set(productsAtom, products.map(product =>
      product.id === productId
        ? { ...product, discounts: product.discounts.filter((_, index) => index !== discountIndex) }
        : product
    ));
    return { success: true, message: '할인 규칙이 삭제되었습니다.' };
  }
);

