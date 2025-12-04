import { ProductHeader } from '@/components/layout/ProductHeader';
import { useCart } from '@/hooks/useCart';
import { useCoupons } from '@/hooks/useCoupons';
import { useFilter } from '@/hooks/useFilter';
import { useProducts } from '@/hooks/useProducts';
import { addNotification } from '@/models/notification';
import { CartItemList } from '@/pages/ProductsPage/components/CartItemList';
import { ProductList } from '@/pages/ProductsPage/components/ProductList';
import { Product } from '@/types';

export const ProductsPage = ({ goPage }: { goPage: (id: string) => void }) => {
  const { products } = useProducts();
  const {
    cart,
    selectedCoupon,
    applyCoupon,
    totals,
    totalItemCount,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { coupons } = useCoupons();

  const handleApplyCoupon = (couponCode: string) => {
    if (!couponCode) {
      return;
    }

    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      addNotification('쿠폰을 찾을 수 없습니다', 'error');
      return;
    }

    const result = applyCoupon(coupon);
    if (!result.valid) {
      addNotification(result.message || '쿠폰을 적용할 수 없습니다', 'error');
    } else if (result.message) {
      addNotification(result.message, 'success');
    }
  };

  const handleCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    clearCart();
  };

  const discountAmount = totals.totalBeforeDiscount - totals.totalAfterDiscount;

  const productFilter = (list: Product[], query: string) => {
    return list.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const { filteredList, query, setQuery, isFiltering } = useFilter<Product>(
    products,
    productFilter,
    { debounceDelay: 500 }
  );

  return (
    <>
      <ProductHeader
        cart={cart}
        query={query}
        setQuery={setQuery}
        totalItemCount={totalItemCount}
        goPage={goPage}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* 상품 목록 */}
            <ProductList
              cart={cart}
              products={filteredList}
              addToCart={addToCart}
              isLoading={isFiltering}
              query={query}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* 장바구니 */}
              <CartItemList
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
              {cart.length > 0 && (
                <>
                  {/* 쿠폰 선택 */}
                  <section className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        쿠폰 할인
                      </h3>
                    </div>
                    {coupons.length > 0 ? (
                      <select
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={selectedCoupon?.code || ''}
                        onChange={(e) => handleApplyCoupon(e.target.value)}
                      >
                        <option value="">쿠폰 선택</option>
                        {coupons.map((coupon) => (
                          <option key={coupon.code} value={coupon.code}>
                            {coupon.name} (
                            {coupon.discountType === 'amount'
                              ? `${coupon.discountValue.toLocaleString()}원`
                              : `${coupon.discountValue}%`}
                            )
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-gray-500">
                        사용 가능한 쿠폰이 없습니다
                      </p>
                    )}
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
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-red-500">
                          <span>할인 금액</span>
                          <span>-{discountAmount.toLocaleString()}원</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="font-semibold">결제 예정 금액</span>
                        <span className="font-bold text-lg text-gray-900">
                          {totals.totalAfterDiscount.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCompleteOrder}
                      className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                    >
                      {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                    </button>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                      <p>* 실제 결제는 이루어지지 않습니다</p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
