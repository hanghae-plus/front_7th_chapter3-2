import { useState } from 'react';
import { useNotification } from './features/notification/hooks/useNotification';
import { Notification } from './features/notification/index';
import { AdminPage } from './pages/admin/AdminPage';
import { ShopPage } from './pages/shop/ShopPage';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, closeNotification } =
    useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
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
