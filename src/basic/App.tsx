import { useState } from 'react';
import { useProduct } from './hooks/useProduct';
import { useCart } from './hooks/useCart';
import { useCoupon } from './hooks/useCoupon';
import { useNotification } from './hooks/useNotification';
import { Notification } from './components/Notification';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { calculateCartTotal } from './utils/cartCalculator';
import { formatCurrencyWon } from './utils/productUtils';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart(products);
  const { coupons, selectedCoupon, addCoupon, deleteCoupon, applyCoupon, clearCoupon } =
    useCoupon();
  const { notifications, addNotification, removeNotification } = useNotification();

  // 장바구니 추가 핸들러
  const handleAddToCart = (product: (typeof products)[0]) => {
    const result = addToCart(product);
    if (result.message) {
      addNotification(result.message, result.success ? 'success' : 'error');
    }
  };

  // 수량 변경 핸들러
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantity(productId, quantity);
    if (result.message) {
      addNotification(result.message, 'error');
    }
  };

  // 쿠폰 적용 핸들러
  const handleApplyCoupon = (coupon: (typeof coupons)[0]) => {
    const currentTotal = calculateCartTotal(cart, null).totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    applyCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  };

  // 주문 완료 핸들러
  const handleCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    clearCoupon();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notif => (
            <Notification key={notif.id} {...notif} onClose={removeNotification} />
          ))}
        </div>
      )}

      {/* 헤더 (관리자 모드일 때만) */}
      {isAdmin && (
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center flex-1">
                <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              </div>
              <nav className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAdmin(!isAdmin)}
                  className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white"
                >
                  쇼핑몰로 돌아가기
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* 메인 콘텐츠 */}
      <main className={isAdmin ? 'py-8' : ''}>
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddCoupon={addCoupon}
            onDeleteCoupon={deleteCoupon}
            onNotification={addNotification}
            formatPrice={(price, isSoldOut) => (isSoldOut ? 'SOLD OUT' : formatCurrencyWon(price))}
          />
        ) : (
          <>
            <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center flex-1">
                    <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
                  </div>
                  <nav className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsAdmin(!isAdmin)}
                      className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
                    >
                      관리자 페이지로
                    </button>
                  </nav>
                </div>
              </div>
            </header>
            <CartPage
              products={products}
              cart={cart}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={removeFromCart}
              onApplyCoupon={handleApplyCoupon}
              onClearCoupon={clearCoupon}
              onCompleteOrder={handleCompleteOrder}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
