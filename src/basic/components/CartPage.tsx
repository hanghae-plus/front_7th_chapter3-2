// 장바구니 페이지 컴포넌트

import { useState, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { useCoupons } from '../hooks/useCoupons';
import { useProducts } from '../entities/product/model/useProducts';
import { calculateItemTotal } from '../entities/cart/model/cart';
import { useDebounce } from '../shared/lib/useDebounce';
import { CartIcon, CloseIcon, ImagePlaceholderIcon } from '../shared/ui/icons';
import { ProductWithUI } from '../shared/config';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export function CartPage() {
  // Hooks
  const { products } = useProducts();
  const { coupons } = useCoupons();
  const {
    cart,
    selectedCoupon,
    addToCart: addToCartBase,
    removeFromCart,
    updateQuantity: updateQuantityBase,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
  } = useCart();

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 알림 상태
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 추가 함수
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  // 알림 닫기 함수
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 장바구니에 상품 추가 (알림 포함)
  const addToCart = (product: ProductWithUI) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }
    addToCartBase(product);
    addNotification('장바구니에 담았습니다', 'success');
  };

  // 수량 변경 (재고 체크 포함)
  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
      return;
    }

    updateQuantityBase(productId, quantity);
  };

  // 검색 필터링 (description도 검색)
  const filteredProducts = (products as ProductWithUI[]).filter(
    (product) =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (product.description &&
        product.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()))
  );

  // 총액 계산
  const totals = calculateTotal();

  // 장바구니 총 아이템 개수
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 주문 완료 처리
  const completeOrder = () => {
    addNotification(
      `주문이 완료되었습니다. 주문번호: ORD-${Date.now()}`,
      'success'
    );
    clearCart();
  };

  return (
    <>
      {/* 알림 메시지 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === 'error'
                  ? 'bg-red-600'
                  : notif.type === 'warning'
                  ? 'bg-yellow-600'
                  : 'bg-green-600'
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-white hover:text-gray-200"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 상품 목록 (왼쪽 3칸) */}
        <div className="lg:col-span-3">
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                전체 상품
              </h2>
              <div className="text-sm text-gray-600">
                총 {products.length}개 상품
              </div>
            </div>

            {/* 검색바 */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="상품 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 상품 그리드 */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            )}
          </section>
        </div>

        {/* 장바구니 사이드바 (오른쪽 1칸) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* 장바구니 섹션 */}
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CartIcon className="w-5 h-5 mr-2" />
                장바구니
                {totalItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <CartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    장바구니가 비어있습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const itemTotal = calculateItemTotal(item, cart);
                    const originalPrice = item.product.price * item.quantity;
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
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(
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
                                updateQuantity(
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

            {/* 쿠폰 및 결제 섹션 */}
            {cart.length > 0 && (
              <>
                {/* 쿠폰 선택 */}
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      쿠폰 할인
                    </h3>
                  </div>
                  {coupons.length > 0 && (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={selectedCoupon?.code || ''}
                      onChange={(e) => {
                        const coupon = coupons.find(
                          (c) => c.code === e.target.value
                        );
                        if (coupon) applyCoupon(coupon);
                      }}
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
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
