import { CartItem, Coupon } from "../../../../types";
import { calculateCartTotal } from "../../../models/cart";
import { CartItemList } from "./CartItemList/CartItemList";
import { CouponSelector } from "./CouponSelector";
import { OrderSummary } from "./OrderSummary";

interface CartProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
}

export const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
}: CartProps) => {
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className="sticky top-24 space-y-4">
      <CartItemList
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />

      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            clearSelectedCoupon={clearSelectedCoupon}
          />

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
