import { useState, useCallback } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import { useNotification } from "./hooks/useNotification";
import { CartIcon } from "./components/icons";
import { UIToast } from "./components/ui/UIToast";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";

const App = () => {
  const { notifications, addNotification, removeNotification } =
    useNotification();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts({
    addNotification,
  });
  const {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart({ products, addNotification });

  const {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  } = useCoupons({ cart, addNotification });

  const [isAdmin, setIsAdmin] = useState(false);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    clearSelectedCoupon();
  }, [addNotification, clearCart, clearSelectedCoupon]);

  return (
    <div className="min-h-screen bg-gray-50">
      <UIToast notifications={notifications} onClose={removeNotification} />
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            </div>
            <nav className="flex items-center space-x-4">
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
              {!isAdmin && (
                <div className="relative">
                  <CartIcon className="w-6 h-6 text-gray-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            addNotification={addNotification}
            cart={cart}
          />
        ) : (
          <CartPage
            products={products}
            cart={cart}
            totalItemCount={totalItemCount}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            clearSelectedCoupon={clearSelectedCoupon}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
