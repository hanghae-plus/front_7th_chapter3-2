import { ProductList } from "../components/ProductList";
import { CartItem, Coupon, ProductWithUI } from "../types";
import { IconCart } from "../components/icons";
import { CartItemRow } from "../components/CartItemRow";

export function CartPage({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  formatPrice,
  addToCart,
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  totals,
  completeOrder,
  calculateItemTotal,
  removeFromCart,
  updateQuantity,
}: {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: ProductWithUI) => void;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
  calculateItemTotal: (item: CartItem) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          formatPrice={formatPrice}
          getRemainingStock={getRemainingStock}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <IconCart className="w-5 h-5 mr-2" />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <IconCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  return (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                      calculateItemTotal={calculateItemTotal}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    쿠폰 할인
                  </h3>
                  <button className="text-xs text-blue-600 hover:underline">
                    쿠폰 등록
                  </button>
                </div>
                {coupons.length > 0 && (
                  <select
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={selectedCoupon?.code || ""}
                    onChange={(e) => {
                      const coupon = coupons.find(
                        (c) => c.code === e.target.value
                      );
                      if (coupon) applyCoupon(coupon);
                      else setSelectedCoupon(null);
                    }}
                  >
                    <option value="">쿠폰 선택</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.code} value={coupon.code}>
                        {coupon.name} (
                        {coupon.discountType === "amount"
                          ? `${coupon.discountValue.toLocaleString()}원`
                          : `${coupon.discountValue}%`}
                        )
                      </option>
                    ))}
                  </select>
                )}
              </section>

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

                <button
                  onClick={completeOrder}
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
  );
}
