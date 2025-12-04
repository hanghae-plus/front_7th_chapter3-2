import { useCallback } from 'react';
import { Product, Discount } from '../../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

interface ProductWithUI extends Product {
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

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    [setProducts]
  );

  const updateProductStock = useCallback(
    (productId: string, stock: number) => {
      updateProduct(productId, { stock });
    },
    [updateProduct]
  );

  const addProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, discounts: [...product.discounts, discount] }
            : product
        )
      );
    },
    [setProducts]
  );

  const removeProductDiscount = useCallback(
    (productId: string, discountIndex: number) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                discounts: product.discounts.filter(
                  (_, index) => index !== discountIndex
                ),
              }
            : product
        )
      );
    },
    [setProducts]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
