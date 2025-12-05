import { createContext, type Dispatch, type SetStateAction, useContext, useMemo } from 'react';
import { type ProductWithUI, useProductsStorage } from '../entities/product';
import { initialProducts } from '../mock/product';

interface ProductContextType {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useProductsStorage(initialProducts);

  const value = useMemo(() => ({ products, setProducts }), [products, setProducts]);
  return <ProductContext value={value}>{children}</ProductContext>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
