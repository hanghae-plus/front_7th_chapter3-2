import { CartItemView } from './CartItemView';
import { CartItem } from './CartItem';
import { CouponView } from './CouponView';
import { PaymentView } from './PaymentView';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { useSearch } from '../../utils/hooks/useSearch';

export function CartPage() {
  const products = useProductStore(state => state.products);
  const cart = useCartStore(state => state.cart);

  const { filteredProducts, debouncedSearchTerm, searchTerm, setSearchTerm } = useSearch(products);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 검색창 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="상품 검색..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 상품 목록 */}
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
              {filteredProducts.map((product) =>
                <CartItem
                  key={product.id}
                  product={product}
                />
              )}
            </div>
          )}
        </section>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartItemView products={products} />
          {cart.length > 0 && (
            <>
              <CouponView />
              <PaymentView />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
