import { ProductWithUI } from "../../store/useProductStore";
import { ProductItem } from "./ProductItem";
import { useProductStore } from "../../store/useProductStore";
import { useCartStore } from "../../store/useCartStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useState, useMemo } from "react";

export const ProductList = () => {
  // Store에서 상태 가져오기
  const { products } = useProductStore();
  const { getRemainingStock, addToCart: addToCartAction } = useCartStore();
  const { addNotification } = useNotificationStore();

  // 로컬 상태: 검색어
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 필터링된 상품 목록 계산
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

  // Notification 래퍼 함수
  const addToCart = (product: ProductWithUI) => {
    const result = addToCartAction(product);
    addNotification(result.message, result.success ? "success" : "error");
  };
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">
          총 {filteredProducts.length}개 상품
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};
