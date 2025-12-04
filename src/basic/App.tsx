import { useState, useCallback } from 'react';
import { Coupon } from '../types';
import AdminDashboardPage from './pages/adminDashboard/AdminDashboardPage';
import ProductPage from './pages/client/ProductPage';
import { initialProducts } from './mock/product';
import { initialCoupons } from './mock/coupon';
import { Notification } from './entities/notification/components/Notification';
import { useCartStorage } from './entities/cart/hooks/useCartStorage';
import { useProductsStorage } from './entities/product/hooks/useProductsStorage';
import { useCouponsStorage } from './entities/coupon/hooks/useCouponsStorage';
import { Header } from './components/Header';
import { useDebounce } from './hooks/useDebounce';
import { useNotification } from './entities/notification/hooks/useNotification';

const SEARCH_DEBOUNCE_DELAY = 500;

const App = () => {
  // Storage State
  const [products, setProducts] = useProductsStorage(initialProducts);
  const [cart, setCart] = useCartStorage([]);
  const [coupons, setCoupons] = useCouponsStorage(initialCoupons);

  // State
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  const { notifications, setNotifications, addNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <Notification notifications={notifications} setNotifications={setNotifications} />
      )}

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setIsAdmin={setIsAdmin}
        setSearchTerm={setSearchTerm}
        cart={cart}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminDashboardPage
            products={products}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setProducts={setProducts}
            setCoupons={setCoupons}
            addNotification={addNotification}
          />
        ) : (
          <ProductPage
            products={products}
            cart={cart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setCart={setCart}
            coupons={coupons}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
