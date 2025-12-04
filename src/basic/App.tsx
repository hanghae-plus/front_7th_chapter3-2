import { useState, useCallback } from 'react';
import { useDebounce } from './utils/hooks/useDebounce';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { CartPage } from './components/CartPage';
import { AdminPage } from './components/AdminPage';
import { CloseIcon, CartIcon } from './components/icons';
import { NOTIFICATION_DURATION, SEARCH_DEBOUNCE_DELAY } from './constants';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const App = () => {
  const { products } = useProducts();
  const {
    cart,
    totalItemCount,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCoupon,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
  } = useCart(products);

  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_DURATION);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={
                'p-4 rounded-md shadow-md text-white flex justify-between items-center ' +
                (notif.type === 'error'
                  ? 'bg-red-600'
                  : notif.type === 'warning'
                  ? 'bg-yellow-600'
                  : 'bg-green-600')
              }
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-white hover:text-gray-200"
              >
                <CloseIcon />
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={
                  'px-3 py-1.5 text-sm rounded transition-colors ' +
                  (isAdmin
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-900')
                }
              >
                {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <CartIcon />
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

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage onNotification={addNotification} />
        ) : (
          <CartPage
            searchTerm={debouncedSearchTerm}
            onNotification={addNotification}
            cart={cart}
            selectedCoupon={selectedCoupon}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            clearCoupon={clearCoupon}
            clearCart={clearCart}
            calculateItemTotal={calculateItemTotal}
            calculateCartTotal={calculateCartTotal}
            getRemainingStock={getRemainingStock}
          />
        )}
      </main>
    </div>
  );
};

export default App;
