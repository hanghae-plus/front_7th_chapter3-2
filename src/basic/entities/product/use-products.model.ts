import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { ToastProps } from '../../shared/ui/toast';
import {
  INITIAL_PRODUCTS,
  PRODUCT_STORAGE_KEY,
} from './product-constants.config';
import { ProductWithUI } from './product-interface.model';

interface UseProductsProps {
  toast: (notification: ToastProps) => void;
}

// TODO: model 분리 및 features 분리
export function useProducts({ toast }: UseProductsProps) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    PRODUCT_STORAGE_KEY,
    INITIAL_PRODUCTS
  );

  /** 새 상품 추가 */
  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };

    setProducts((prev) => [...prev, product]);

    toast({
      message: '상품이 추가되었습니다.',
      type: 'success',
    });
  };

  /** 상품 정보 수정 */
  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );

    toast({
      message: '상품이 수정되었습니다.',
      type: 'success',
    });
  };

  /** 상품 삭제 */
  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    toast({
      message: '상품이 삭제되었습니다.',
      type: 'success',
    });
  };

  // /** 상품 재고 수정 */
  // const updateProductStock = (productId: string, stock: number) => {
  //   setProducts(prev =>
  //     prev.map(product =>
  //       product.id === productId ? { ...product, stock } : product,
  //     ),
  //   );

  //   onAddNotification({
  //     message: '상품이 수정되었습니다.',
  //     type: 'success',
  //   });
  // };

  // /** 상품 할인 규칙 추가 */
  // const addProductDiscount = (productId: string, discount: Discount) => {
  //   setProducts(prev =>
  //     prev.map(product =>
  //       product.id === productId ? { ...product, discounts: [...product.discounts, discount] } : product,
  //     ),
  //   );
  // };

  // /** 상품 할인 규칙 삭제 */
  // const removeProductDiscount = (productId: string, discountIndex: number) => {
  //   setProducts(prev =>
  //     prev.map(product =>
  //       product.id === productId ? { ...product, discounts: product.discounts.filter((_, index) => index !== discountIndex) } : product,
  //     ),
  //   );
  // };

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    // updateProductStock,
    // addProductDiscount,
    // removeProductDiscount,
  };
}
