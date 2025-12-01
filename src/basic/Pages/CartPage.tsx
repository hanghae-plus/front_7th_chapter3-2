import { useCallback, useState, type FC } from "react";
import { useCoupons } from "../hooks/useCoupons";
import { useCart } from "../hooks/useCart";
import ProductCards from "../components/ProductCards";
import CartArea from "../components/CartArea";
import { useProducts } from "../hooks/useProducts";

interface IProps {
  searchTerm?: string;
}

const CartPage: FC<IProps> = ({ searchTerm }) => {
  const { products, setProducts } = useProducts();
  const { coupons, applyCoupon, removeCoupon } = useCoupons();
  const { cart, addToCart, removeFromCart, emptyCart } = useCart();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    emptyCart();
    removeCoupon();
  }, [addNotification]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductCards
          products={products}
          addToCart={addToCart}
          searchTerm={searchTerm}
          setProducts={setProducts}
          getRemainingStock={}
        />
      </div>

      <div className="lg:col-span-1">
        <CartArea
          cart={cart}
          coupons={coupons}
          selectedCoupon={null}
          totals={calculateCartTotal()}
          calculateItemTotal={}
          removeFromCart={removeFromCart}
          updateQuantity={}
          applyCoupon={applyCoupon}
          setSelectedCoupon={}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
};

export default CartPage;
