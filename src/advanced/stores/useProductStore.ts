import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Product } from '../../types';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

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

const loadFromStorage = (): ProductWithUI[] => {
  try {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  } catch {
    return initialProducts;
  }
};

interface ProductStore {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  _reset: () => void;
}

export const useProductStore = create<ProductStore>()(
  subscribeWithSelector((set) => ({
    products: loadFromStorage(),

    addProduct: (newProduct) =>
      set((state) => ({
        products: [
          ...state.products,
          { ...newProduct, id: `p${Date.now()}` },
        ],
      })),

    updateProduct: (productId, updates) =>
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        ),
      })),

    deleteProduct: (productId) =>
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      })),

    _reset: () => set({ products: initialProducts }),
  }))
);

// localStorage 동기화
useProductStore.subscribe(
  (state) => state.products,
  (products) => {
    localStorage.setItem('products', JSON.stringify(products));
  }
);
