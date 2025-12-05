import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { Toast } from "./components/ui/Toast";
import { useCart } from "./hooks/useCart";
import { useProduct } from "./hooks/useProduct";
import { useCoupon } from "./hooks/useCoupon";
import { CartCounter } from "./components/CartCounter";
import { ProductSearchBar } from "./components/ProductSearchBar";
import { Coupon } from "../types";
import { useToast } from "./utils/hooks/useToast";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, notify } = useToast();

  const { cart, setCart, addToCart, removeFromCart, updateQuantity } =
    useCart();

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  } = useProduct();

  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  } = useCoupon();

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePurchase = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    notify(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
  }, [notify, setCart, setSelectedCoupon]);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notification) => (
            <Toast key={notification.id} notification={notification} />
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
            applyCoupon={(coupon: Coupon) => applyCoupon(cart, coupon)}
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
