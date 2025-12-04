import { useState } from 'react';
import AdminDashboardPage from './pages/adminDashboard/AdminDashboardPage';
import { type Coupon, useCouponsStorage } from './entities/coupon';
import ProductPage from './pages/client/ProductPage';
import { initialProducts } from './mock/product';
import { initialCoupons } from './mock/coupon';
import { NotificationContainer, useNotification } from './entities/notification';
import { useProductsStorage } from './entities/product';
import { Header } from './components/Header';
import { useDebounce } from './hooks/useDebounce';
import { useCartStorage } from './entities/cart';

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
      <NotificationContainer notifications={notifications} setNotifications={setNotifications} />

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
