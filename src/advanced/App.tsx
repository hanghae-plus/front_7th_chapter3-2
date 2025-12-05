import { useState } from 'react';
import { NotificationContainer } from './components/common/Notification';
import { CartPageProvider } from './components/common/CartPageProvider';
import { AdminPageProvider } from './components/common/AdminPageProvider';
import { CartPageLayout, AdminPageLayout } from './components/layout';
import { NotificationsProvider, useNotificationsContext } from './contexts';
import { useDebounce } from './hooks/useDebounce';

const AppContent = () => {
  const { notifications, removeNotification } = useNotificationsContext();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      {isAdmin ? (
        <AdminPageProvider>
          <AdminPageLayout isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        </AdminPageProvider>
      ) : (
        <CartPageProvider>
          <CartPageLayout
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        </CartPageProvider>
      )}
    </div>
  );
};

const App = () => {
  return (
    <NotificationsProvider>
      <AppContent />
    </NotificationsProvider>
  );
};

export default App;
