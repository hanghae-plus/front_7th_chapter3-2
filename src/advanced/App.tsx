import { useState, useCallback } from "react";

import { useNotification } from "./hooks/useNotification";
import { UIToast } from "./components/ui/UIToast";

import Header from "./components/Header";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";

const App = () => {
  const { notifications, addNotification, removeNotification } =
    useNotification();
  const { clearCart } = useCart();
  const { clearSelectedCoupon } = useCoupons();

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
      <Header isAdmin={isAdmin} toggleAdmin={() => setIsAdmin(!isAdmin)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage completeOrder={completeOrder} />}
      </main>
    </div>
  );
};

export default App;
