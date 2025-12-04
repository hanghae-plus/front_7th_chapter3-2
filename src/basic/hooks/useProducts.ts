import { useCallback, useMemo } from "react";
import { CartItem } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useDebounce } from "../utils/hooks/useDebounce";
import { ProductWithUI, initialProducts } from "../constants";
import { formatPrice } from "../utils/formatters";
import * as productModel from "../models/product";

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
    () => productModel.filterProducts(products, debouncedSearchTerm),
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

  // 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const result = productModel.addProduct(products, newProduct);
      setProducts(result.products);
      addNotification?.("상품이 추가되었습니다.", "success");
    },
    [products, setProducts, addNotification]
  );

  // 상품 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(productModel.updateProduct(products, productId, updates));
      addNotification?.("상품이 수정되었습니다.", "success");
    },
    [products, setProducts, addNotification]
  );

  // 상품 삭제
  const removeProduct = useCallback(
    (productId: string) => {
      setProducts(productModel.removeProduct(products, productId));
      addNotification?.("상품이 삭제되었습니다.", "success");
    },
    [products, setProducts, addNotification]
  );

  return {
    products,
    filteredProducts,
    debouncedSearchTerm,
    getFormattedPrice,
    addProduct,
    updateProduct,
    removeProduct,
  };
}
