import Header from "./components/Header";
import Notifications from "./components/Notifications";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useUIStore } from "./stores/useUIStore";
import { useNotificationStore } from "./stores/useNotificationStore";

const App = () => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const { cart, setCart, totalItemCount, addToCart, removeFromCart } =
    useCart(addNotification);
  const {
    coupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
  } = useCoupons(addNotification);

  const isAdmin = useUIStore((state) => state.isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 토스트 UI */}
      <Notifications />

      {/* 헤더 */}
      <Header cart={cart} totalItemCount={totalItemCount} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
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
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </main>
    </div>
  );
};

export default App;
