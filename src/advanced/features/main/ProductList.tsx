import { ProductItem } from "./ProductItem";
import { useProductStore } from "../../store/useProductStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useMemo } from "react";

interface ProductListProps {
  searchTerm: string;
}

/**
 * ProductList - 상품 목록 컴포넌트
 *
 * Props drilling 제거: 콜백 함수와 계산값을 자식에게 전달하지 않음
 * ProductItem이 내부에서 직접 store를 호출합니다.
 */
export const ProductList = ({ searchTerm }: ProductListProps) => {
  // Store에서 상태 가져오기
  const { products } = useProductStore();

  // 검색어 디바운스
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
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
