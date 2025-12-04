import { useState, useCallback } from "react";
import { Coupon } from "../types";
import Header from "./components/ui/Header";
import Notification from "./components/ui/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import useProducts from "./hooks/useProducts";
import useCart from "./hooks/useCart";
import useCoupons from "./hooks/useCoupons";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useLocalStorage } from "./utils/hooks/useLocalStorage";
import { useNotification } from "./utils/hooks/useNotification";

const App = () => {
  // Notification 관리
  const { notifications, setNotifications, addNotification } = useNotification();

  // 데이터 관리
  const products = useProducts();
  const cart = useCart();
  const coupons = useCoupons(addNotification);

  // LocalStorage 동기화
  useLocalStorage("products", products.data);
  useLocalStorage("cart", cart.data, { removeIfEmpty: true });
  useLocalStorage("coupons", coupons.data);

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Debounce 적용
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 주문 완료 핸들러
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    cart.clearCart();
    cart.applyCoupon(null);
  }, [addNotification, cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 영역 */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* 헤더 */}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart.data}
        totalItemCount={cart.data.reduce((sum, item) => sum + item.quantity, 0)}
      />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products.data}
            addProduct={products.addProduct}
            updateProduct={products.updateProduct}
            deleteProduct={products.deleteProduct}
            coupons={coupons.data}
            addCoupon={coupons.addCoupon}
            deleteCoupon={coupons.deleteCoupon}
            selectedCoupon={cart.selectedCoupon}
            setSelectedCoupon={cart.applyCoupon}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products.data}
            cart={cart.data}
            coupons={coupons.data}
            selectedCoupon={cart.selectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
            completeOrder={completeOrder}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.removeFromCart}
            applyCoupon={cart.applyCoupon}
            addToCart={cart.addToCart}
            calculateTotal={cart.calculateTotal}
            getRemainingStock={cart.getRemainingStock}
          />
        )}
      </main>
    </div>
  );
};

export default App;
