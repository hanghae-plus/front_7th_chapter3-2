import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { ProductWithUI } from "../types/ProductWithUI";
import { initialProducts } from "../constants/initialProducts";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { formatProductPrice } from "../utils/formatProductPrice";

type ProductItemInstance = ProductWithUI & {
  priceLabel: (type?: "₩{price}" | "{price}원") => string;
  update: (updates: Partial<ProductWithUI>) => void;
  delete: () => void;
};

export type ProductsContextValue = {
  list: ProductItemInstance[];
  filteredList: ProductItemInstance[];
  searchTerm: string;
  getById: (productId: string) => ProductItemInstance | undefined;
  addItem: (product: ProductWithUI) => void;
  search: (term: string) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const productInstance: ProductItemInstance[] = useMemo(
    () =>
      products.map((product, idx) => ({
        ...product,
        priceLabel: (type = "{price}원") =>
          formatProductPrice(product, {
            formatOptions:
              type === "₩{price}"
                ? { type: "prefix", prefix: "₩" }
                : { type: "suffix", suffix: "원" },
          }),
        update: (updates: Partial<ProductWithUI>) => {
          setProducts((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], ...updates };
            return next;
          });
        },
        delete: () => {
          setProducts((prev) => prev.filter((_, i) => i !== idx));
        },
      })),
    [products, setProducts]
  );

  const filteredList = useMemo(
    () =>
      debouncedSearchTerm !== ""
        ? productInstance.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()))
          )
        : productInstance,
    [productInstance, debouncedSearchTerm]
  );

  const getById = useCallback(
    (productId: string) => {
      return productInstance.find((product) => product.id === productId);
    },
    [productInstance]
  );

  const addItem = useCallback(
    (product: ProductWithUI) => {
      setProducts((prev) => [...prev, product]);
    },
    [setProducts]
  );

  const search = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const value: ProductsContextValue = useMemo(
    () => ({
      list: productInstance,
      filteredList,
      searchTerm,
      getById,
      addItem,
      search,
    }),
    [productInstance, filteredList, searchTerm, getById, addItem, search]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
}

