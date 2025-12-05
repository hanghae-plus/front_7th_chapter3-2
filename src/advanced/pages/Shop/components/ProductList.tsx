import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { getRemainingStock } from "../../../models/cart";
import { ProductCard } from "./ProductCard";
import { cartAtom, productsAtom } from "../../../atoms";
import { useCart } from "../../../hooks/useCart";
import { filterProductsBySearchTerm } from "../../../models/product";

interface ProductListProps {
  debouncedSearchTerm: string;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const ProductList = ({
  debouncedSearchTerm,
  addNotification,
}: ProductListProps) => {
  // products와 cart를 직접 구독
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);
  const { add: addToCart } = useCart({ onMessage: addNotification });

  // 필터링된 상품 목록 계산
  const filteredProducts = useMemo(
    () => filterProductsBySearchTerm(products, debouncedSearchTerm),
    [products, debouncedSearchTerm]
  );

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const remainingStock = getRemainingStock(product, cart);

            return (
              <ProductCard
                key={product.id}
                product={product}
                remainingStock={remainingStock}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
