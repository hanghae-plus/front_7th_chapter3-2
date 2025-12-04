import { CartItem, ProductWithUI } from "../../../types/types";
import { filterProducts } from "../../../utils/product";

import ProductCard from "./ProductCard";

interface ProductListProps {
  products: ProductWithUI[];
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
  debouncedSearchTerm: string;
}

export const ProductList = ({
  products,
  cart,
  addToCart,
  debouncedSearchTerm,
}: ProductListProps) => {
  const filteredProducts = filterProducts(products, debouncedSearchTerm);

  return (
    <div className="lg:col-span-3">
      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">
            총 {products.length}개 상품
          </div>
        </div>

        {/* 검색 결과에 따라 UI 출력 달라짐 */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                product={product}
                cart={cart}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
