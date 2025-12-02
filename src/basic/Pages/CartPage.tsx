import { useCallback, useState, type FC } from "react";
import { useCoupons } from "../hooks/useCoupons";
import { useCart } from "../hooks/useCart";
import ProductCards from "../components/ProductCards";
import CartSummary from "../components/CartArea";

interface IProps {
  searchTerm?: string;
}

const CartPage: FC<IProps> = ({ searchTerm }) => {
  // const { coupons, applyCoupon, removeCoupon } = useCoupons();
  // const { cart, addToCart, removeFromCart, emptyCart } = useCart();

  // const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // const addNotification = useCallback(
  //   (message: string, type: "error" | "success" | "warning" = "success") => {
  //     const id = Date.now().toString();
  //     setNotifications((prev) => [...prev, { id, message, type }]);

  //     setTimeout(() => {
  //       setNotifications((prev) => prev.filter((n) => n.id !== id));
  //     }, 3000);
  //   },
  //   []
  // // );

  // const completeOrder = useCallback(() => {
  //   const orderNumber = `ORD-${Date.now()}`;
  //   addNotification(
  //     `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
  //     "success"
  //   );
  //   emptyCart();
  //   removeCoupon();
  // }, [addNotification]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductCards searchTerm={searchTerm} />
      </div>

      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;
