import Admin from './pages/admin/AdminPage';
import Cart from './pages/CartPage';
import Notifications from './components/Notifications';
import { useViewMode } from './hooks/useViewMode';
import Header from './components/Header';
import { AppProviders, useNotificationContext } from './contexts';

const AppContent = () => {
  const { viewMode, toggleViewMode, isCartView, isAdminView } =
    useViewMode('cart');

  const { notifications, setNotifications } = useNotificationContext();

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
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'admin' ? <Admin /> : <Cart />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
