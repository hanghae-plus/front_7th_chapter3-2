import { CartList } from "../../cart/ui/CartList";
import { CartPayment } from "../../cart/ui/CartPayment";
import { CouponSelector } from "../../coupon/ui/CouponSelector";
import { CartItem, Coupon, Product } from "../../../types";

export function PaymentBanner({
  cart,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  totals,
  completeOrder,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (product: Product, newQuantity: number) => void;
  calculateItemTotal: (item: CartItem) => number;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
}) {
  return (
    <>
      <CartList
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        calculateItemTotal={calculateItemTotal}
      />

      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
          />
          <CartPayment totals={totals} completeOrder={completeOrder} />
        </>
      )}
    </>
  );
}
