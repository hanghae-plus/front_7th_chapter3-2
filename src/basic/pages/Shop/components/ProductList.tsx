import { CartItem, ProductWithUI } from "../../../../types";
import { getRemainingStock } from "../../../models/cart";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  productsLength: number;
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
}

export const ProductList = ({
  productsLength,
  filteredProducts,
  debouncedSearchTerm,
  cart,
  addToCart,
}: ProductListProps) => {
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {productsLength}개 상품</div>
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
