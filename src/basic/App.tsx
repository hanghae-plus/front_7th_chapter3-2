import { useState } from "react";
import AdminPage from "./Pages/AdminPage";
import CartPage from "./Pages/CartPage";
import Header from "./components/layout/Header";
import { useSearch } from "./hooks/useSearch";
import NotificationList, {
  type Notification,
} from "./components/layout/NotificationList";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<"cart" | "admin">("cart");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { searchTerm, setSearchTerm } = useSearch();

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
        setIsAdmin={setIsAdmin}
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
