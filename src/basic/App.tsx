import { useState } from 'react';
import { useNotification } from './features/notification/hooks/useNotification';
import { NotificationSection } from './features/notification/NotificationSection';
import { AdminPage } from './pages/AdminPage';
import { ShopPage } from './pages/ShopPage';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, closeNotification } =
    useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSection
        notifications={notifications}
        closeNotification={closeNotification}
      />
      {isAdmin ? (
        <AdminPage
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
        />
      ) : (
        <ShopPage
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default App;
