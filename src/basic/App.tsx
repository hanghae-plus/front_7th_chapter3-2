import { useState } from "react";
import { Notifications } from "./components/common/ui/Notifications";
import { Header } from "./components/Header";
import { PageAdmin } from "./pages/PageAdmin";
import { useNotification } from "./hooks/useNotification";
import { useCoupons } from "./hooks/useCoupons";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { PageShopping } from "./pages/PageShopping";

const App = () => {
  const { notifications, setNotifications, addNotification } =
    useNotification();
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon } =
    useCoupons();
  const { products, setProducts } = useProducts();
  const { cart, setCart } = useCart();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <PageAdmin
            cart={cart}
            products={products}
            setProducts={setProducts}
            handleNotificationAdd={addNotification}
            coupons={coupons}
            setCoupons={setCoupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ) : (
          <PageShopping
            products={products}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setCart={setCart}
            searchTerm={searchTerm}
            handleNotificationAdd={addNotification}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </main>
    </div>
  );
};

export default App;
