import { useState, useCallback, useEffect } from "react";
import { Header } from "./components/Header";
import type { Notification } from "./types";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { Toast } from "./components/ui/Toast";
import { useCart } from "./hooks/useCart";
import { useProduct } from "./hooks/useProduct";
import { useCoupon } from "./hooks/useCoupon";
import { CartCounter } from "./components/CartCounter";
import { ProductSearchBar } from "./components/ProductSearchBar";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

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

  const { cart, setCart, addToCart, removeFromCart, updateQuantity } = useCart({
    addNotification,
  });

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  } = useProduct({
    addNotification,
  });

  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  } = useCoupon({
    addNotification,
  });

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePurchase = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              notification={notification}
              setNotifications={(noti: Notification) =>
                setNotifications((prev) => prev.filter((n) => n.id !== noti.id))
              }
            />
          ))}
        </div>
      )}
      <Header>
        {!isAdmin && (
          <ProductSearchBar searchTerm={searchTerm} onChange={setSearchTerm} />
        )}
        <nav className="flex ml-auto items-center space-x-4">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              isAdmin
                ? "bg-gray-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
          </button>
          {!isAdmin && <CartCounter totalItemCount={totalItemCount} />}
        </nav>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            notify={addNotification}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
            addProduct={addProduct}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={addToCart}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
            onPurchase={handlePurchase}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
      </main>
    </div>
  );
};

export default App;
