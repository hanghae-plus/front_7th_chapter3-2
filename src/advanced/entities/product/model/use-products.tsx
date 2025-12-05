import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';
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

interface ProductContextValue {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined
);

export function ProductProvider({ children }: { children: ReactNode }) {
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

  const value: ProductContextValue = {
    products: state.items,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
