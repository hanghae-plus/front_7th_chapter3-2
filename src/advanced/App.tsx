import { useState } from 'react';
import AdminDashboardPage from './pages/adminDashboard/AdminDashboardPage';
import { type Coupon } from './entities/coupon';
import ProductPage from './pages/client/ProductPage';
import { NotificationContainer, useNotification } from './entities/notification';
import { Header } from './components/Header';
import { useDebounce } from './hooks/useDebounce';

const SEARCH_DEBOUNCE_DELAY = 500;

const App = () => {
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
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminDashboardPage
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
          />
        ) : (
          <ProductPage
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
