import { useState } from 'react';
import Admin from './pages/admin/AdminPage';
import Cart from './pages/CartPage';
import Notifications from './components/Notifications';
import { useViewMode } from './hooks/useViewMode';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import { useNotifications } from './hooks/useNotifications';
import Header from './components/Header';

const App = () => {
  const { viewMode, toggleViewMode, isCartView, isAdminView } =
    useViewMode('cart');

  const { notifications, addNotification, setNotifications } =
    useNotifications();

  const cartActions = useCart(addNotification);
  const { cart } = cartActions;

  const couponActions = useCoupons(addNotification);
  const { coupons } = couponActions;

  const productActions = useProducts();
  const { products } = productActions;

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <Header
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
        isAdminView={isAdminView}
        isCartView={isCartView}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'admin' ? (
          <Admin
            addNotification={addNotification}
            cart={cart}
            productActions={productActions}
            couponActions={couponActions}
          />
        ) : (
          <Cart
            addNotification={addNotification}
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
