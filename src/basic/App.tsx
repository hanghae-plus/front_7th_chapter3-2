import { useState, useCallback } from 'react';
import Admin from './Admin';
import Cart from './Cart';
import Notifications from './Notifications';
import { Notification } from '../types';
import { useViewMode } from './hooks/useViewMode';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import SearchBar from './components/SesarchBar';

const App = () => {
  const { viewMode, toggleViewMode, isCartView, isAdminView } =
    useViewMode('cart');
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const cartActions = useCart(addNotification);
  const { cart } = cartActions;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const { coupons, setCoupons } = useCoupons();
  const { products, setProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {viewMode === 'cart' && (
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="ml-8 flex-1 max-w-md"
                />
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={toggleViewMode}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdminView
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isAdminView ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </button>
              {isCartView && (
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'admin' ? (
          <Admin
            setNotifications={setNotifications}
            cart={cart}
            products={products}
            coupons={coupons}
            setProducts={setProducts}
            setCoupons={setCoupons}
          />
        ) : (
          <Cart
            setNotifications={setNotifications}
            cartActions={cartActions}
            products={products}
            coupons={coupons}
            searchTerm={searchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
