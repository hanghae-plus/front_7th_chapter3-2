// TODO: 메인 App 컴포넌트
// 힌트:
// 1. isAdmin 상태를 관리하여 쇼핑몰/관리자 모드 전환
// 2. 네비게이션 바에 모드 전환 버튼 포함
// 3. 조건부 렌더링으로 CartPage 또는 AdminPage 표시
// 4. 상태 관리는 각 페이지 컴포넌트에서 처리 (App은 라우팅만 담당)

import { useState } from "react";
import { Header } from "./components/layout/Header";
import Notifications from "./components/Notifications";
import { AdminPage } from "./pages/Admin/AdminPage";
import { ShopPage } from "./pages/Shop/ShopPage";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotifications } from "./hooks/useNotifications";
import { useDebounce } from "./utils/hooks/useDebounce";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { notifications, addNotification, setNotifications } =
    useNotifications();

  const products = useProducts({
    onMessage: addNotification,
  });

  const cart = useCart({
    products: products.value,
    onMessage: addNotification,
  });

  const coupons = useCoupons({
    onMessage: addNotification,
    onDeleteSelectedCoupon: (deletedCode) => {
      cart.clearSelectedCouponByCode(deletedCode); // cart가 책임지는 로직
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin((prev) => !prev)}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        hasCartItems={cart.value.length > 0}
        totalItemCount={cart.totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addNotification={addNotification}
          />
        ) : (
          <ShopPage
            products={products.value}
            searchTerm={debouncedSearchTerm}
            cart={cart}
            coupons={coupons}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
