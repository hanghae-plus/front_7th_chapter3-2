import { Discount, Product, ProductWithUI } from '../../types';
import { initialProducts } from '../constants';
import { useLocalStorage } from './useLocalStorage';
import * as productModel from '../models/product';

type NotificationFn = (
  message: string,
  type: 'error' | 'success' | 'warning'
) => void;

export const useProducts = (addNotification?: NotificationFn) => {
  // - updateProductStock: 재고 수정
  // - addProductDiscount: 할인 규칙 추가
  // - removeProductDiscount: 할인 규칙 삭제

  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}-${Math.random()}`,
    };

    setProducts((prev) => productModel.addProduct(product, prev));

    addNotification?.('상품이 추가되었습니다.', 'success');
    return newProduct;
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    const existingProduct = products.find((p) => p.id === productId);
    if (!existingProduct) {
      return;
    }

    setProducts((prev) =>
      productModel.updateProduct(
        {
          id: productId,
          ...updates,
        },
        prev
      )
    );
  };

  const removeProduct = (productId: string) => {
    setProducts((prev) => productModel.removeProduct(productId, prev));
  };

  const updateProductStock = (product: ProductWithUI) => {
    const existingProduct = products.find((p) => p.id === product.id);
    if (!existingProduct) {
      return;
    }
    setProducts((prev) => productModel.updateProductStock(product, prev));
  };

  const addProductDiscount = (discount: Discount, product: Product) => {
    const existingProduct = products.find((p) => p.id === product.id);
    if (!existingProduct) {
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? productModel.updateDiscountForProduct(discount, p)
          : p
      )
    );
  };

  return {
    products,
    addProduct,
    updateProduct,
    updateProductStock,
    addProductDiscount,
    removeProduct,
  };
};
