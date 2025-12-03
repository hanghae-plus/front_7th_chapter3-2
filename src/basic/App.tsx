import { useState } from "react";
import AdminPage from "./Pages/AdminPage";
import CartPage from "./Pages/CartPage";
import CartHeader from "./components/layout/CartHeader";
import { useSearch } from "./hooks/useSearch";
import NotificationList, {
  type Notification,
} from "./components/layout/NotificationList";
import { useCart } from "./hooks/useCart";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<"cart" | "admin">("cart");
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
      <CartHeader
        searchTerm={searchTerm}
        totalCount={totalCartCount}
        onChange={(prev) => setIsAdmin(!prev)}
        setSearchTerm={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <CartPage searchTerm={searchTerm} />
        {/* {isAdmin ? <></> : <CartPage searchTerm={searchTerm} />} */}
      </main>
    </div>
  );
};

export default App;
