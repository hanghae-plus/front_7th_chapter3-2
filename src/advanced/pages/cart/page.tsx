import { Layout } from '../../widgets/layout.ui';
import { Header } from '../../widgets/header.ui';
import { useMemo, useState } from 'react';
import { useDebounce } from '../../shared/hooks/use-debounce';
import { ConditionalRender } from '../../shared/ui/conditional-render';
import { useCart, calculateTotal } from '../../entities/cart/model/use-cart';
import {
  filterProductsBySearchTerm,
  useProducts,
} from '../../entities/product';
import { ProductCardList } from './ui/product-card-list';
import { ProductEmptyFallback } from './ui/product-empty-fallback';
import { CartItemList } from './ui/cart-item-list';
import { CartEmptyFallback } from './ui/cart-empty-fallback';
import { CouponList } from './ui/coupon-list';
import { useOrderCart } from '../../features/cart/order-cart';
import { useCoupons } from '../../entities/coupon';
import { ShoppingCartIcon } from '../../shared/ui/icons';
import { Button } from '../../shared/ui/button';

export function CartPage() {
  const { coupons } = useCoupons();
  const { products } = useProducts();
  const { cart, selectedCoupon } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = filterProductsBySearchTerm(
    products,
    debouncedSearchTerm
  );
  const totals = calculateTotal(cart, selectedCoupon);
  const { onOrderCart } = useOrderCart();

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <Layout
      header={
        <Header
          searchTerm={searchTerm}
          totalItemCount={totalItemCount}
          onChangeSearchTerm={setSearchTerm}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* 상품 목록 */}
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                전체 상품
              </h2>
              <div className="text-sm text-gray-600">
                총 {products.length}개 상품
              </div>
            </div>
            <ConditionalRender
              condition={filteredProducts.length > 0}
              fallback={
                <ProductEmptyFallback searchTerm={debouncedSearchTerm} />
              }
            >
              <ProductCardList products={filteredProducts} />
            </ConditionalRender>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* 장바구니 */}
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ShoppingCartIcon className="mr-2" />
                장바구니
              </h2>
              <ConditionalRender
                condition={cart.length > 0}
                fallback={<CartEmptyFallback />}
              >
                <CartItemList />
              </ConditionalRender>
            </section>

            <ConditionalRender condition={cart.length > 0}>
              {/* 쿠폰 할인 */}
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    쿠폰 할인
                  </h3>
                  <Button
                    variant="link"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    쿠폰 등록
                  </Button>
                </div>
                <ConditionalRender condition={coupons.length > 0}>
                  <CouponList coupons={coupons} />
                </ConditionalRender>
              </section>

              {/* 결제 정보 */}
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">
                      {totals.totalBeforeDiscount.toLocaleString()}원
                    </span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount >
                    0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>
                        -
                        {(
                          totals.totalBeforeDiscount - totals.totalAfterDiscount
                        ).toLocaleString()}
                        원
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="font-semibold">결제 예정 금액</span>
                    <span className="font-bold text-lg text-gray-900">
                      {totals.totalAfterDiscount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <Button variant="warning" fullWidth onClick={onOrderCart}>
                  {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                </Button>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  <p>* 실제 결제는 이루어지지 않습니다</p>
                </div>
              </section>
            </ConditionalRender>
          </div>
        </div>
      </div>
    </Layout>
  );
}
