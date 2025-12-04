import { useMemo } from 'react';
import { useProductStore, useUIStore } from '../../stores';
import { useDebounce } from '../../hooks';
import { filterProducts } from '../../utils/formatters';
import { ProductCard } from './ProductCard';

export function ProductList() {
  const products = useProductStore((state) => state.products);
  const searchTerm = useUIStore((state) => state.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedSearchTerm),
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
          <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
