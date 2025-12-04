import { useState } from "react";
import { Provider } from "jotai";
import AdminPage from "./Pages/AdminPage";
import CartPage from "./Pages/CartPage";

import { useNotification } from "./hooks/useNotification";
import NotificationList from "./components/NotificationList";

const AppContent = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, remove } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList notifications={notifications} onClose={remove} />
      {isAdmin ? (
        <AdminPage onChange={() => setIsAdmin(false)} />
      ) : (
        <CartPage onChange={() => setIsAdmin(true)} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
