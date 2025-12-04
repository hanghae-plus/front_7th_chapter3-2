import { createContext, type Dispatch, type SetStateAction, useContext } from 'react';
import { type ProductWithUI } from '../types';
import { useProductsStorage } from '../hooks/useProductsStorage';
import { initialProducts } from '../../../mock/product';

interface ProductContextType {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useProductsStorage(initialProducts);

  return <ProductContext value={{ products, setProducts }}>{children}</ProductContext>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
