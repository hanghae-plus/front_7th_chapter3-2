import { ProductWithUI } from '../types';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';

export const useProductsStorage = (initialProducts: ProductWithUI[]) => {
  return useLocalStorageState<ProductWithUI[]>('products', initialProducts);
};
