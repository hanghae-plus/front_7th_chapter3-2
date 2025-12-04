import { useState } from "react";
import AdminPage from "./Pages/AdminPage";
import CartPage from "./Pages/CartPage";

import { useNotification } from "./hooks/useNotification";
import NotificationList from "./components/NotificationList";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, remove } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList notifications={notifications} onClose={remove} />
      {isAdmin ? (
        <AdminPage
          addNotification={addNotification}
          onChange={() => setIsAdmin(false)}
        />
      ) : (
        <CartPage
          addNotification={addNotification}
          onChange={() => setIsAdmin(true)}
        />
      )}
    </div>
  );
};

export default App;
