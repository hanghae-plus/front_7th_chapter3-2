import { useState } from "react";
import AdminPage from "./Pages/AdminPage";
import CartPage from "./Pages/CartPage";
import CartHeader from "./components/layout/CartHeader";
import { useSearch } from "./hooks/useSearch";
import NotificationList, {
  type Notification,
} from "./components/layout/NotificationList";
import { useCart } from "./hooks/useCart";
import AdminHeader from "./components/layout/AdminHeader";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { searchTerm, setSearchTerm } = useSearch();
  const { cart } = useCart();

  const handleCloseNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList
        notifications={notifications}
        onClose={handleCloseNotification}
      />
      {isAdmin ? (
        <AdminHeader onChange={() => setIsAdmin(false)} />
      ) : (
        <CartHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalCount={totalCartCount}
          onChange={() => setIsAdmin(true)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage searchTerm={searchTerm} />}
      </main>
    </div>
  );
};

export default App;
