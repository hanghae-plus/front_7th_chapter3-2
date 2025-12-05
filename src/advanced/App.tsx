import { useState } from "react";
import Notification from "./components/ui/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import useCart from "./hooks/useCart";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useLocalStorage } from "./utils/hooks/useLocalStorage";
import { useNotification } from "./utils/hooks/useNotification";
import { CouponProvider } from "./hooks/useCoupons";
import { ProductProvider } from "./hooks/useProducts";

const App = () => {
  // Notification 관리
  const { notifications, setNotifications, addNotification } = useNotification();

  const cart = useCart();
  useLocalStorage("cart", cart.data, { removeIfEmpty: true });

  // 상태 관리
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <>
      <ProductProvider>
        <CouponProvider>
          <div className="min-h-screen bg-gray-50">
            {/* 알림 영역 */}
            <Notification notifications={notifications} setNotifications={setNotifications} />

            {/* 메인 컨텐츠 */}
            {isAdmin ? (
              <AdminPage
                selectedCoupon={cart.selectedCoupon}
                setSelectedCoupon={cart.applyCoupon}
                addNotification={addNotification}
                goShoppingPage={() => setIsAdmin(false)}
              />
            ) : (
              <CartPage
                cart={cart.data}
                selectedCoupon={cart.selectedCoupon}
                debouncedSearchTerm={debouncedSearchTerm}
                addNotification={addNotification}
                updateQuantity={cart.updateQuantity}
                removeFromCart={cart.removeFromCart}
                applyCoupon={cart.applyCoupon}
                addToCart={cart.addToCart}
                calculateTotal={cart.calculateTotal}
                getRemainingStock={cart.getRemainingStock}
                clearCart={cart.clearCart}
                setSearchTerm={setSearchTerm}
                goAdminPage={() => setIsAdmin(true)}
              />
            )}
          </div>
        </CouponProvider>
      </ProductProvider>
    </>
  );
};

export default App;
