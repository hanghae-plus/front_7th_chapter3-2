import { useState, useCallback } from "react";
import { Notification } from "./shared/model/types";

// Widgets (UI 조립)
import { Header } from "./widgets/Header/ui";
import { ProductList } from "./widgets/ProductList/ui";
import { CartSidebar } from "./widgets/CartSidebar/ui";
import { AdminDashboard } from "./widgets/AdminDashboard/ui";

// Feature Hooks (비즈니스 로직)
import { useProducts } from "./features/product/model/useProducts";
import { useCoupons } from "./features/coupon/model/useCoupons";
import { useCart } from "./features/cart/model/useCart";
import { useDebounce } from "./shared/lib/useDebounce";

const App = () => {
  // 1. Shared Logic: 알림 시스템
  // (테스트가 '알림 메시지 자동 사라짐'을 체크하므로 레거시 로직 유지)
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  // 2. Feature Hooks: 도메인 로직 주입
  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification);

  const { coupons, addCoupon, deleteCoupon } = useCoupons(addNotification);

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
  } = useCart(products, addNotification);

  // 3. UI State: 화면 제어
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // 검색 필터링 로직
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 메시지 영역 (Shared UI) */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notif.id)
                  )
                }
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 헤더 위젯 */}
      <Header
        cart={cart}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 대시보드 위젯
          <AdminDashboard
            products={products}
            coupons={coupons}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddCoupon={addCoupon}
            onDeleteCoupon={deleteCoupon}
            onNotification={addNotification}
          />
        ) : (
          // 쇼핑몰 화면 위젯 조합
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ProductList
                products={filteredProducts}
                totalCount={products.length}
                cart={cart}
                onAddToCart={addToCart}
                searchTerm={debouncedSearchTerm}
              />
            </div>

            <div className="lg:col-span-1">
              <CartSidebar
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                onApplyCoupon={applyCoupon}
                onCompleteOrder={completeOrder}
                onCouponSelected={setSelectedCoupon}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
