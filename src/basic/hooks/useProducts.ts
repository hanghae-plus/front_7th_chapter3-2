import { useCallback, useMemo } from "react";
import { CartItem } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useDebounce } from "../utils/hooks/useDebounce";
import { ProductWithUI, initialProducts } from "../constants";
import { formatPrice } from "../utils/formatters";

type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

/**
 * 상품 관리를 위한 커스텀 훅
 * @param searchTerm - 검색어 (옵션)
 * @param addNotification - 알림 함수 (옵션)
 * @param isAdmin - 관리자 모드 여부 (옵션)
 */
export function useProducts(
  searchTerm: string = "",
  addNotification?: NotifyFn,
  isAdmin: boolean = false
) {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  // 검색어 디바운싱
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 필터링된 상품 목록
  const filteredProducts = useMemo(
    () =>
      debouncedSearchTerm
        ? products.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()))
          )
        : products,
    [products, debouncedSearchTerm]
  );

  // 가격 포맷팅 함수 (cart는 호출 시 전달)
  const getFormattedPrice = useCallback(
    (price: number, productId?: string, cart: CartItem[] = []) => {
      const product = productId
        ? products.find((p) => p.id === productId)
        : undefined;
      return formatPrice(price, { isAdmin, product, cart });
    },
    [products, isAdmin]
  );

  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification?.("상품이 추가되었습니다.", "success");
    },
    [setProducts, addNotification]
  );

  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification?.("상품이 수정되었습니다.", "success");
    },
    [setProducts, addNotification]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification?.("상품이 삭제되었습니다.", "success");
    },
    [setProducts, addNotification]
  );

  return {
    products,
    filteredProducts,
    debouncedSearchTerm,
    getFormattedPrice,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
}
