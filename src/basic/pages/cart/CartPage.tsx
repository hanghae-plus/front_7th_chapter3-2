import { useCart } from '../../hooks/useCart';
import { useCoupons } from '../../hooks/useCoupons';
import { useSearch } from '../../utils/hooks/useSearch';
import { CartItemView } from './CartItemView';
import { CartItem } from './CartItem';
import { CouponView } from './CouponView';
import { PaymentView } from './PaymentView';
import { useProducts } from '../../hooks/useProducts';

interface CartPageProps {
  cartHook: ReturnType<typeof useCart>;
  productHook: ReturnType<typeof useProducts>;
  couponsHook: ReturnType<typeof useCoupons>;
  searchHook: ReturnType<typeof useSearch>;
}

export function CartPage({
  cartHook,
  productHook,
  couponsHook,
  searchHook
}: CartPageProps) {

  const { cart } = cartHook;
  const { products } = productHook;
  const { filteredProducts, debouncedSearchTerm } = searchHook;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
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
                  cartHook={cartHook}
                  />
              )}
            </div>
          )}
        </section>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartItemView
            products={products}
            cartHook={cartHook}
          />
          {cart.length > 0 && (
            <>
              <CouponView
                cartHook={cartHook}
                couponsHook={couponsHook}
              />
              <PaymentView
                cartHook={cartHook}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
