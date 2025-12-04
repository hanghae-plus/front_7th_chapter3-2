import { useCallback } from "react";
import { CartItem, Product, Coupon } from "../../types";
import { getRemainingStock } from "../App";
import { isValidStock } from "../utils/validators";
import CartListItem from "../components/cart/CartListItem";
import ProductListItem from "../components/product/ProductListItem";
import SelectList from "../components/SelectList";
import { calculateCartTotal, calculateItemTotal } from "../models/cart";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const CartPage = ({
  products,
  debouncedSearchTerm,
  formatPrice,
  addToCart,
  cart,
  updateQuantity,
  removeFromCart,
  selectedCoupon,
  coupons,
  completeOrder,
  setSelectedCoupon,
  addNotification,
}: {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  formatPrice: (price: number, productId?: string) => string;
  cart: CartItem[];

  addToCart: (product: ProductWithUI) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  selectedCoupon: Coupon | null;
  coupons: Coupon[];
  completeOrder: () => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
}) => {
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.", "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, calculateCartTotal]
  );

  const totals = calculateCartTotal(cart, selectedCoupon);

  const handleAddToCart = (cart: CartItem[], product: Product) => {
    const remainingStock = getRemainingStock(cart, product);
    if (!isValidStock(remainingStock)) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    // 상품이 장바구니에 없으면 추가
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (!existingItem) {
      addToCart(product);
      return;
    }

    // 상품이 장바구니에 있으면
    // 재고 초과 체크 후 수량 업데이트
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
      return;
    }

    updateQuantity(product.id, newQuantity);
  };

  const couponList = [
    { label: "쿠폰 선택", value: "" },
    ...coupons.map((coupon) => ({
      label: `${coupon.name} (${
        coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`
      })`,
      value: coupon.code,
    })),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                return (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    formatPrice={formatPrice}
                    handleAddToCart={() => handleAddToCart(cart, product)}
                  />
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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              장바구니
            </h2>
            {cart.length === 0 ? (
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
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal(item, cart);
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

                  return (
                    <CartListItem
                      key={item.product.id}
                      item={item}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                      hasDiscount={hasDiscount}
                      discountRate={discountRate}
                      itemTotal={itemTotal}
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
                  <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
                  <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
                </div>
                {coupons.length > 0 && (
                  <SelectList
                    options={couponList}
                    value={selectedCoupon?.code || ""}
                    onChange={(e) => {
                      const coupon = coupons.find((c) => c.code === e.target.value);
                      if (coupon) applyCoupon(coupon);
                      else setSelectedCoupon(null);
                    }}
                  />
                )}
              </section>

              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">{totals.totalBeforeDiscount.toLocaleString()}원</span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>-{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원</span>
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
};

export default CartPage;
