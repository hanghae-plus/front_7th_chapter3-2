// TODO: 메인 App 컴포넌트
// 힌트:
// 1. isAdmin 상태를 관리하여 쇼핑몰/관리자 모드 전환
// 2. 네비게이션 바에 모드 전환 버튼 포함
// 3. 조건부 렌더링으로 CartPage 또는 AdminPage 표시
// 4. 상태 관리는 각 페이지 컴포넌트에서 처리 (App은 라우팅만 담당)

import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./components/layout/Header";
import Notifications from "./components/Notifications";
import { AdminPage } from "./pages/Admin/AdminPage";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import {
  calculateCartTotal,
  calculateItemTotal,
  getRemainingStock,
} from "./models/cart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotifications } from "./hooks/useNotifications";
import { useDebounce } from "./utils/hooks/useDebounce";
import { filterProductsBySearchTerm } from "./models/product";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { notifications, addNotification, setNotifications } =
    useNotifications();

  const products = useProducts({
    onMessage: addNotification,
  });

  const cart = useCart({
    products: products.value,
    onMessage: addNotification,
  });

  const coupons = useCoupons({
    onMessage: addNotification,
    onDeleteSelectedCoupon: (deletedCode) => {
      cart.clearSelectedCouponByCode(deletedCode); // cart가 책임지는 로직
    },
  });

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.value.find((p) => p.id === productId);
      if (product && getRemainingStock(product, cart.value) <= 0) {
        return "SOLD OUT";
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    cart.clearCart();
  }, [addNotification]);

  const totals = calculateCartTotal(cart.value, cart.selectedCoupon);

  const filteredProducts = useMemo(
    () => filterProductsBySearchTerm(products.value, debouncedSearchTerm),
    [products.value, debouncedSearchTerm]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin((prev) => !prev)}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        hasCartItems={cart.value.length > 0}
        totalItemCount={cart.totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addNotification={addNotification}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 상품 목록 */}
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    전체 상품
                  </h2>
                  <div className="text-sm text-gray-600">
                    총 {products.value.length}개 상품
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
                    {filteredProducts.map((product) => {
                      const remainingStock = getRemainingStock(
                        product,
                        cart.value
                      );

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {/* 상품 이미지 영역 (placeholder) */}
                          <div className="relative">
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                              <svg
                                className="w-24 h-24 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            {product.isRecommended && (
                              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                BEST
                              </span>
                            )}
                            {product.discounts.length > 0 && (
                              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                ~
                                {Math.max(
                                  ...product.discounts.map((d) => d.rate)
                                ) * 100}
                                %
                              </span>
                            )}
                          </div>

                          {/* 상품 정보 */}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            {/* 가격 정보 */}
                            <div className="mb-3">
                              <p className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price, product.id)}
                              </p>
                              {product.discounts.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  {product.discounts[0].quantity}개 이상 구매시
                                  할인 {product.discounts[0].rate * 100}%
                                </p>
                              )}
                            </div>

                            {/* 재고 상태 */}
                            <div className="mb-3">
                              {remainingStock <= 5 && remainingStock > 0 && (
                                <p className="text-xs text-red-600 font-medium">
                                  품절임박! {remainingStock}개 남음
                                </p>
                              )}
                              {remainingStock > 5 && (
                                <p className="text-xs text-gray-500">
                                  재고 {remainingStock}개
                                </p>
                              )}
                            </div>

                            {/* 장바구니 버튼 */}
                            <button
                              onClick={() => cart.add(product)}
                              disabled={remainingStock <= 0}
                              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                remainingStock <= 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-900 text-white hover:bg-gray-800"
                              }`}
                            >
                              {remainingStock <= 0 ? "품절" : "장바구니 담기"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    장바구니
                  </h2>
                  {cart.value.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">
                        장바구니가 비어있습니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.value.map((item) => {
                        const itemTotal = calculateItemTotal(cart.value, item);
                        const originalPrice =
                          item.product.price * item.quantity;
                        const hasDiscount = itemTotal < originalPrice;
                        const discountRate = hasDiscount
                          ? Math.round((1 - itemTotal / originalPrice) * 100)
                          : 0;

                        return (
                          <div
                            key={item.product.id}
                            className="border-b pb-3 last:border-b-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 flex-1">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => cart.remove(item.product.id)}
                                className="text-gray-400 hover:text-red-500 ml-2"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    cart.updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <span className="text-xs">−</span>
                                </button>
                                <span className="mx-3 text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    cart.updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <span className="text-xs">+</span>
                                </button>
                              </div>
                              <div className="text-right">
                                {hasDiscount && (
                                  <span className="text-xs text-red-500 font-medium block">
                                    -{discountRate}%
                                  </span>
                                )}
                                <p className="text-sm font-medium text-gray-900">
                                  {Math.round(itemTotal).toLocaleString()}원
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {cart.value.length > 0 && (
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
                      {coupons.value.length > 0 && (
                        <select
                          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                          value={cart.selectedCoupon?.code || ""}
                          onChange={(e) => {
                            const coupon = coupons.value.find(
                              (c) => c.code === e.target.value
                            );
                            if (coupon) cart.apply(coupon);
                            else cart.clearSelectedCoupon();
                          }}
                        >
                          <option value="">쿠폰 선택</option>
                          {coupons.value.map((coupon) => (
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
                        {totals.totalBeforeDiscount -
                          totals.totalAfterDiscount >
                          0 && (
                          <div className="flex justify-between text-red-500">
                            <span>할인 금액</span>
                            <span>
                              -
                              {(
                                totals.totalBeforeDiscount -
                                totals.totalAfterDiscount
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
        )}
      </main>
    </div>
  );
};

export default App;
