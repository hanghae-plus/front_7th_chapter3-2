import { CartList } from "../../cart/ui/CartList";
import { CartPayment } from "../../cart/ui/CartPayment";
import { CouponSelector } from "../../coupon/ui/CouponSelector";
import { CartItem, Coupon, Product } from "../../../types";
import { calculateCartTotal } from "../../../features/calculate-price/model/calculateCartTotal";

export function PaymentBanner({
  cart,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  completeOrder,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (product: Product, newQuantity: number) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  completeOrder: () => void;
}) {
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <>
      <CartList
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
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
