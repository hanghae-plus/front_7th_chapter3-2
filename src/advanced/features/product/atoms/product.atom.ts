import { atom } from 'jotai';
import { ProductWithUI } from '../hooks/useProduct';

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.',
  },
];

// localStorage에서 초기값 로드
const loadProductsFromStorage = (): ProductWithUI[] => {
  if (typeof window === 'undefined') return initialProducts;

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

// 상품 목록 atom
export const productsAtom = atom<ProductWithUI[]>(loadProductsFromStorage());

// localStorage 동기화를 위한 atom
export const productsWithStorageAtom = atom(
  (get) => get(productsAtom),
  (
    get,
    set,
    newProducts: ProductWithUI[] | ((prev: ProductWithUI[]) => ProductWithUI[]),
  ) => {
    const currentProducts = get(productsAtom);
    const updatedProducts =
      typeof newProducts === 'function'
        ? newProducts(currentProducts)
        : newProducts;

    set(productsAtom, updatedProducts);

    // localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  },
);

