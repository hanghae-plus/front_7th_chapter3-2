import { useCallback, useEffect, useReducer } from 'react';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';
import {
  INITIAL_PRODUCTS,
  PRODUCT_STORAGE_KEY,
} from '../config/product-constants';
import { ProductWithUI } from './product-interface';
import { productReducer, initialProductState } from './product-reducer';
import {
  productActions,
  validateAddProduct,
  validateUpdateProduct,
} from './product-actions';

export function useProducts() {
  // LocalStorage에서 초기 상품 로드
  const [persistedProducts, setPersistedProducts] = useLocalStorage<
    ProductWithUI[]
  >(PRODUCT_STORAGE_KEY, INITIAL_PRODUCTS);

  // Reducer로 상태 관리
  const [state, dispatch] = useReducer(productReducer, {
    ...initialProductState,
    items: persistedProducts,
  });

  // LocalStorage 동기화
  useEffect(() => {
    setPersistedProducts(state.items);
  }, [state.items, setPersistedProducts]);

  /** 새 상품 추가 */
  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    validateAddProduct(newProduct);
    dispatch(productActions.addProduct(newProduct));
  }, []);

  /** 상품 정보 수정 */
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      validateUpdateProduct(updates);
      dispatch(productActions.updateProduct(productId, updates));
    },
    []
  );

  /** 상품 삭제 */
  const deleteProduct = useCallback((productId: string) => {
    dispatch(productActions.deleteProduct(productId));
  }, []);

  return {
    products: state.items,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
