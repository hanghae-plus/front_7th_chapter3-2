import { useState, useCallback } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import { useNotification } from "./hooks/useNotification";
import { UIToast } from "./components/ui/UIToast";

import Header from "./components/Header";
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
      <Header
        isAdmin={isAdmin}
        toggleAdmin={() => setIsAdmin(!isAdmin)}
        cart={cart}
        totalItemCount={totalItemCount}
      />

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
