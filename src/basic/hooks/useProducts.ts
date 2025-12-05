// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열 -
// - updateProduct: 상품 정보 수정 -
// - addProduct: 새 상품 추가 -

import { useCallback } from "react";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../constant";
import {
  addProductToList,
  removeProductFromList,
  updateProductInList,
} from "../models/product";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useProducts = ({
  onMessage,
}: {
  onMessage?: (message: string, type?: "error" | "success" | "warning") => void;
}) => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI[] = addProductToList(products, newProduct);
      setProducts(product);
      onMessage?.("상품이 추가되었습니다.");
    },
    [onMessage]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      const nextProducts = updateProductInList(products, productId, updates);
      setProducts(nextProducts);
      onMessage?.("상품이 수정되었습니다.");
    },
    [onMessage]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const nextProducts = removeProductFromList(products, productId);
      setProducts(nextProducts);
      onMessage?.("상품이 삭제되었습니다.");
    },
    [onMessage]
  );

  return {
    value: products,
    add: addProduct,
    update: updateProduct,
    delete: deleteProduct,
  };
};
