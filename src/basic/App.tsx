import { useState } from "react";
import AdminPage from "./Pages/AdminPage";
import CartPage from "./Pages/CartPage";
import Header from "./components/layout/Header";
import { useSearch } from "./hooks/useSearch";
import { useCart } from "./hooks/useCart";
import NotificationList, { type Notification }  from "./components/layout/NotificationList";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { searchTerm, setSearchTerm } = useSearch();
  const { cart, setCart } = useCart();

  const handleCloseNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList
        notifications={notifications}
        onClose={handleCloseNotification}
      />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        cart={cart}
        setIsAdmin={setIsAdmin}
        setSearchTerm={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage searchTerm={searchTerm} />}
      </main>
    </div>
  );
};

export default App;
