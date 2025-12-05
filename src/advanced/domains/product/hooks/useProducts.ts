import { useStore } from "../../../shared/stores/store";

export function useProducts() {
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);

  return {
    products,
    setProducts,
  };
}
