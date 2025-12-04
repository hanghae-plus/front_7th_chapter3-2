import { calculateCartTotal } from "../../../models/cart";
import CartItemList from "./CartItemList";
import { CouponSelector } from "./CouponSelector";
import { OrderSummary } from "./OrderSummary";
import { useCart } from "../../../hooks/useCart";
import { useCoupons } from "../../../hooks/useCoupons";

interface CartProps {
  completeOrder: () => void;
}

export const Cart = ({ completeOrder }: CartProps) => {
  const { cart } = useCart();
  const { selectedCoupon } = useCoupons();
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className="sticky top-24 space-y-4">
      <CartItemList />

      {cart.length > 0 && (
        <>
          <CouponSelector />

          <OrderSummary
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            completeOrder={completeOrder}
          />
        </>
      )}
    </div>
  );
};

export default Cart;
