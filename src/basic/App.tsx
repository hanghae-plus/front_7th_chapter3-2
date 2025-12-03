import { useState } from "react";
import Header from "./components/Header";
import ShoppingMallTemplate from "./components/ShoppingMall/Template";
import AdminTemplate from "./components/Admin/Template";
import Noti from "./components/Notification";
import { useCart } from "./hooks/useCart";
import useCoupon from "./hooks/useCoupons";
import useProduct from "./hooks/useProducts";
import useNotificaton from "./hooks/useNotificaton";
import { useDebounce } from "./hooks/useDebounce";
import { filterProducts } from "./utils/productCalculations";

const App = () => {
  const { notifications, setNotifications, addNotification } = useNotificaton();
  const {
    cart,
    totalItemCount,
    setCart,
    addToCart,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
    removeFromCart,
    updateQuantity,
  } = useCart({
    addNotification,
  });
  const { products, addProduct, updateProduct, deleteProduct } = useProduct({ addNotification });
  const { coupons, selectedCoupon, applyCoupon, setSelectedCoupon, addCoupon, deleteCoupon } = useCoupon({
    addNotification,
    calculateCartTotal,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const totals = calculateCartTotal(selectedCoupon);

  // 순수 함수를 사용하여 상품 필터링
  const filteredProductList = filterProducts(products, debouncedSearchTerm);

  return (
    <div className="min-hx-screen bg-gray-50">
      <Noti notifications={notifications} setNotifications={setNotifications} />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        totalItemCount={totalItemCount}
        cart={cart}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminTemplate
            products={products}
            coupons={coupons}
            activeTab={activeTab}
            getRemainingStock={getRemainingStock}
            setActiveTab={setActiveTab}
            deleteCoupon={deleteCoupon}
            deleteProduct={deleteProduct}
            addNotification={addNotification}
            addProduct={addProduct}
            updateProduct={updateProduct}
            addCoupon={addCoupon}
          />
        ) : (
          <ShoppingMallTemplate
            products={products}
            coupons={coupons}
            cart={cart}
            filteredProducts={filteredProductList}
            debouncedSearchTerm={debouncedSearchTerm}
            selectedCoupon={selectedCoupon}
            totals={totals}
            getRemainingStock={getRemainingStock}
            addToCart={addToCart}
            calculateItemTotal={calculateItemTotal}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            setCart={setCart}
          />
        )}
      </main>
    </div>
  );
};

export default App;
