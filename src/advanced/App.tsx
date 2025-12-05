import { useState, useEffect } from 'react';
import { AdminPage } from './pages/admin/AdminPage';
import { CartPage } from './pages/cart/CartPage';
import { Header } from './components/Header';
import { NotificationContainer } from './components/Notification';
import { useNotificationStore } from './store/notificationStore';
import { useProductStore } from './store/productStore';
import { useCartStore } from './store/cartStore';
import { useCouponStore } from './store/couponStore';
import { initialProducts, initialCoupons } from './constants';

const App = () => {
  const notifications = useNotificationStore(state => state.notifications);
  const removeNotification = useNotificationStore(state => state.removeNotification);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const productsData = localStorage.getItem('products');
    const cartData = localStorage.getItem('cart');
    const couponsData = localStorage.getItem('coupons');

    if (!productsData && !cartData && !couponsData) {
      useProductStore.setState({ products: initialProducts });
      useCartStore.setState({ cart: [], selectedCoupon: null });
      useCouponStore.setState({ coupons: initialCoupons });
      useNotificationStore.setState({ notifications: [] });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

export default App;
