import {
  addDiscountToList,
  addProductToList,
  Discount,
  Product,
  ProductValidation,
  removeDiscountFromList,
  removeProductInList,
  updateProductInList,
  updateStockInList,
  validateAddProduct,
  validateRemoveCartItem,
  validateUpdateProduct,
} from '@/features/product';
import { useLocalStorage } from '@/shared/hooks';
import { useCallback } from 'react';

const initialProducts: Product[] = [
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
  const [products, setProducts] = useLocalStorage<Product[]>(
    'products',
    initialProducts
  );

  const addProduct = useCallback(
    (
      newProduct: Omit<Product, 'id'>,
      options?: {
        onSuccess?: (validation: ProductValidation) => void;
        onError?: (validation: ProductValidation) => void;
      }
    ) => {
      const result = validateAddProduct(products, newProduct);
      if (!result.valid) {
        options?.onError?.(result);
        return;
      }

      setProducts((prev) => addProductToList(prev, newProduct));
      options?.onSuccess?.(result);
    },
    [products, setProducts]
  );

  const updateProduct = useCallback(
    (
      product: Partial<Product>,
      options?: {
        onSuccess?: (validation: ProductValidation) => void;
        onError?: (validation: ProductValidation) => void;
      }
    ) => {
      if (!product.id) {
        options?.onError?.({
          valid: false,
          error: 'NOT_FOUND',
          message: '상품 ID가 필요합니다.',
        });
        return;
      }

      const result = validateUpdateProduct(products, product.id, product);
      if (!result.valid) {
        options?.onError?.(result);
        return;
      }

      setProducts((prev) => updateProductInList(prev, product));
      options?.onSuccess?.(result);
    },
    [products, setProducts]
  );

  const deleteProduct = useCallback(
    (
      productId: string,
      options?: {
        onSuccess?: (validation: ProductValidation) => void;
        onError?: (validation: ProductValidation) => void;
      }
    ) => {
      const result = validateRemoveCartItem(products, productId);
      if (!result.valid) {
        options?.onError?.(result);
        return;
      }

      setProducts((prev) => removeProductInList(prev, productId));
      options?.onSuccess?.(result);
    },
    [products, setProducts]
  );

  const updateProductStock = useCallback(
    (productId: string, stock: number) => {
      setProducts((prev) => updateStockInList(prev, productId, stock));
    },
    [setProducts]
  );

  const addProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setProducts((prev) => addDiscountToList(prev, productId, discount));
    },
    [setProducts]
  );

  const removeProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setProducts((prev) => removeDiscountFromList(prev, productId, discount));
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
