import { useState, useCallback, useEffect } from 'react';
import { useProduct, useCoupon, useCart, type ProductWithUI } from './hooks';
import { getMaxDiscountPercent, getAppliedDiscountRate } from './models';
import { formatPrice, formatAdminPrice } from './utils';
import { CartPage, AdminPage } from './pages';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const App = () => {
  // 엔티티 훅
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const {
    coupons,
    selectedCoupon,
    applyCoupon,
    removeCoupon,
    addCoupon,
    deleteCoupon
  } = useCoupon();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getRemainingStock,
    getItemTotal
  } = useCart(selectedCoupon);

  // UI 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);

  // 알림 추가 함수
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    },
    []
  );

  // 총 아이템 수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 검색어 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 장바구니 추가 핸들러 (알림 포함)
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }
      addToCart(product);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [addToCart, getRemainingStock, addNotification]
  );

  // 수량 업데이트 핸들러 (알림 포함)
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find(p => p.id === productId);
      if (!product) return;

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, updateQuantity, removeFromCart, addNotification]
  );

  // 쿠폰 적용 핸들러 (알림 포함)
  const handleApplyCoupon = useCallback(
    (coupon: typeof selectedCoupon) => {
      if (!coupon) {
        removeCoupon();
        return;
      }

      const currentTotal = getCartTotal().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error'
        );
        return;
      }

      applyCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [applyCoupon, removeCoupon, getCartTotal, addNotification]
  );

  // 주문 완료 핸들러
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    removeCoupon();
  }, [clearCart, removeCoupon, addNotification]);

  // 상품 추가 핸들러 (알림 포함)
  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addProduct, addNotification]
  );

  // 상품 수정 핸들러 (알림 포함)
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [updateProduct, addNotification]
  );

  // 상품 삭제 핸들러 (알림 포함)
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [deleteProduct, addNotification]
  );

  // 쿠폰 추가 핸들러 (알림 포함)
  const handleAddCoupon = useCallback(
    (newCoupon: { name: string; code: string; discountType: 'amount' | 'percentage'; discountValue: number }) => {
      const existingCoupon = coupons.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      addCoupon(newCoupon);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addCoupon, addNotification]
  );

  // 쿠폰 삭제 핸들러 (알림 포함)
  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [deleteCoupon, addNotification]
  );

  // 가격 포맷팅 (관리자/사용자 구분)
  const displayPrice = useCallback(
    (price: number, productId?: string): string => {
      if (productId) {
        const product = products.find(p => p.id === productId);
        if (product && getRemainingStock(product) <= 0) {
          return 'SOLD OUT';
        }
      }

      if (isAdmin) {
        return formatAdminPrice(price);
      }

      return formatPrice(price);
    },
    [products, getRemainingStock, isAdmin]
  );

  // 할인율 계산 (cart 전달)
  const getDiscountRate = useCallback(
    (item: { product: { id: string; name: string; price: number; stock: number; discounts: Array<{ quantity: number; rate: number }> }; quantity: number }) => {
      return getAppliedDiscountRate(item, cart);
    },
    [cart]
  );

  const totals = getCartTotal();

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        product =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 영역 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notif => (
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
                onClick={() =>
                  setNotifications(prev => prev.filter(n => n.id !== notif.id))
                }
                className="text-white hover:text-gray-200"
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
          ))}
        </div>
      )}

      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            displayPrice={displayPrice}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            searchTerm={debouncedSearchTerm}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            getRemainingStock={getRemainingStock}
            displayPrice={displayPrice}
            getMaxDiscountPercent={getMaxDiscountPercent}
            getItemTotal={getItemTotal}
            getDiscountRate={getDiscountRate}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={removeFromCart}
            onApplyCoupon={handleApplyCoupon}
            onCompleteOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
