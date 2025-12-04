import { CartService } from "../../../domains/cart/hooks/useCart";
import { ProductsService } from "../../../domains/products/hooks/useProducts";
import { ProductCard } from "./ProductCard/ProductCard";

type ProductListSectionProps = {
  products: ProductsService;
  cart: CartService;
};

export function ProductListSection({
  products,
  cart,
}: ProductListSectionProps) {
  return (
    <div className="lg:col-span-3">
      {/* 상품 목록 */}
      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">
            총 {products.filteredList.length}개 상품
          </div>
        </div>
        {products.filteredList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              "{products.searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filteredList.map((product) => (
              <ProductCard key={product.id} product={product} cart={cart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
