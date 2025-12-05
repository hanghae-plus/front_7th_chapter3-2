import { useState } from "react";
import Notification from "./components/ui/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./hooks/useCart";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useNotification } from "./utils/hooks/useNotification";
import { CouponProvider } from "./hooks/useCoupons";
import { ProductProvider } from "./hooks/useProducts";

const AppContent = () => {
  const { notifications, setNotifications, addNotification } = useNotification();
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 영역 */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* 메인 컨텐츠 */}
      {isAdmin ? (
        <AdminPage addNotification={addNotification} goShoppingPage={() => setIsAdmin(false)} />
      ) : (
        <CartPage
          debouncedSearchTerm={debouncedSearchTerm}
          addNotification={addNotification}
          setSearchTerm={setSearchTerm}
          goAdminPage={() => setIsAdmin(true)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <ProductProvider>
        <CouponProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </CouponProvider>
      </ProductProvider>
    </CartProvider>
  );
};

export default App;
