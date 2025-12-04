import { useState } from "react";
import Header from "./components/Header";
import Notifications from "./components/Notifications";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { useNotification } from "./hooks/useNotification";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useDebounce } from "./utils/hooks/useDebounce";

const App = () => {
  const { notifications, setNotifications, addNotification } =
    useNotification();
  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification);
  const { cart, setCart, totalItemCount, addToCart, removeFromCart } =
    useCart(addNotification);
  const {
    coupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
  } = useCoupons(addNotification);

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 토스트 UI */}
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* 헤더 */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addNotification={addNotification}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
          />
        ) : (
          <CartPage
            cart={cart}
            setCart={setCart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            products={products}
            addNotification={addNotification}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
