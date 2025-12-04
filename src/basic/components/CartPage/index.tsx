// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시
// - Cart: 장바구니 표시 및 결제
import { useState } from "react";
import { Product, CartItem, Coupon } from "../../../types";
import { ProductWithUI, TIMING } from "../../constants";
import {
  getRemainingStock,
  isSoldOut,
  calculateCartTotal,
  calculateItemTotal,
} from "../../models/cart";
import {
  filterProductsBySearch,
  getMaxDiscountRate,
  getStockStatusMessage,
  getAddToCartButtonState,
} from "../../models/product";
import { calculateDiscountRate, hasDiscount } from "../../models/discount";
import { formatDiscount, formatPriceUnit } from "../../utils/formatters";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { Card, QuantityControl } from "../ui";
import {
  CloseIcon,
  EmptyCartIcon,
  EmptyCartIconSmall,
  ImageIcon,
} from "../icons";

interface CartPageProps {
  products: Product[];
  cart: CartItem[];
  totalItemCount: number;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
}

export const CartPage = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
}: CartPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(
    searchTerm,
    TIMING.SEARCH_DEBOUNCE_MS
  );

  const totals = calculateCartTotal(cart, selectedCoupon);
  const filteredProducts = filterProductsBySearch(
    products,
    debouncedSearchTerm
  );

  return (
    <>
      {/* 검색창 */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="상품 검색..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

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
                  const stockStatus = getStockStatusMessage(remainingStock);
                  const buttonState = getAddToCartButtonState(remainingStock);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* 상품 이미지 영역 (placeholder) */}
                      <div className="relative">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-24 h-24 text-gray-300" />
                        </div>
                        {product.isRecommended && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            BEST
                          </span>
                        )}
                        {product.discounts.length > 0 && (
                          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            ~{formatDiscount(getMaxDiscountRate(product))}
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
                            {isSoldOut(products, cart, product.id)
                              ? "SOLD OUT"
                              : formatPriceUnit(product.price)}
                          </p>
                          {product.discounts.length > 0 && (
                            <p className="text-xs text-gray-500">
                              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
                              {product.discounts[0].rate * 100}%
                            </p>
                          )}
                        </div>

                        {/* 재고 상태 */}
                        <div className="mb-3">
                          {stockStatus && (
                            <p className={stockStatus.className}>
                              {stockStatus.message}
                            </p>
                          )}
                        </div>

                        {/* 장바구니 버튼 */}
                        <button
                          onClick={() => addToCart(product)}
                          disabled={buttonState.disabled}
                          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${buttonState.className}`}
                        >
                          {buttonState.label}
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
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <EmptyCartIconSmall className="w-5 h-5 mr-2" />
                장바구니
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <EmptyCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    장바구니가 비어있습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const itemTotal = calculateItemTotal(item, cart);
                    const originalPrice = item.product.price * item.quantity;
                    const itemHasDiscount = hasDiscount(
                      itemTotal,
                      originalPrice
                    );
                    const discountRate = calculateDiscountRate(
                      itemTotal,
                      originalPrice
                    );

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
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <QuantityControl
                            quantity={item.quantity}
                            onDecrease={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            onIncrease={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          />
                          <div className="text-right">
                            {itemHasDiscount && (
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
            </Card>

            {cart.length > 0 && (
              <>
                <Card className="p-4">
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
                        else clearSelectedCoupon();
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
                </Card>

                <Card className="p-4">
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
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
