import { useProductStore } from '../../../shared/stores';
import { Product } from './types';

interface UseProductListReturn {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

/**
 * 상품 목록 도메인 훅
 * Zustand Store를 래핑하여 도메인 인터페이스 제공
 */
export const useProductList = (): UseProductListReturn => {
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
