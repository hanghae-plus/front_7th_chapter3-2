import { useState, useCallback } from "react";
import { Coupon } from "../types";
import Header from "./components/ui/Header";
import Notification from "./components/ui/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import useProducts from "./hooks/useProducts";
import useCart from "./hooks/useCart";
import useCoupons from "./hooks/useCoupons";
import { useDebounce } from "./hooks/useDebounce";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useNotification } from "./hooks/useNotification";
import cartModel from "./models/cart";
import formatter from "./utils/formatter";

const App = () => {
  // Notification 관리
  const { notifications, setNotifications, addNotification } = useNotification();

  // 데이터 관리
  const products = useProducts(addNotification);
  const cart = useCart();
  const coupons = useCoupons(addNotification);

  // LocalStorage 동기화
  useLocalStorage("products", products.data);
  useLocalStorage("cart", cart.data, { removeIfEmpty: true });
  useLocalStorage("coupons", coupons.data);

  // 상태 관리
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Debounce 적용
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 가격 포맷팅 (관리자 모드에 따라 다른 형식 적용)
  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      // 재고 체크
      if (productId) {
        const product = products.data.find((p) => p.id === productId);
        if (product && cartModel.getRemainingStock(cart.data, product) <= 0) {
          return "SOLD OUT";
        }
      }

      // 관리자 모드에서는 원화 표시 방식 변경
      if (isAdmin) {
        return `${price.toLocaleString()}원`;
      }

      return formatter.formatPrice(price);
    },
    [products.data, cart.data, isAdmin]
  );

  // 주문 완료 핸들러
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    cart.clearCart();
    setSelectedCoupon(null);
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
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products.data}
            cart={cart.data}
            coupons={coupons.data}
            selectedCoupon={selectedCoupon}
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
