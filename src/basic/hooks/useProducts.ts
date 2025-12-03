import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants/data";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useProducts = () => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  return { products, setProducts };
};
