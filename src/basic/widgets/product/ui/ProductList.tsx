import { ProductWithUI } from "../../../types";
import { ProductCard } from "../../../entities/product/ui/ProductCard";

export function ProductList({
  products,
  filteredProducts,
  debouncedSearchTerm,
  formatPrice,
  getRemainingStock,
  addToCart,
}: {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  formatPrice: (price: number, productId?: string) => string;
  getRemainingStock: (product: ProductWithUI) => number;
  addToCart: (product: ProductWithUI) => void;
}) {
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
            return (
              <ProductCard
                key={product.id}
                product={product}
                formatPrice={formatPrice}
                getRemainingStock={getRemainingStock}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
