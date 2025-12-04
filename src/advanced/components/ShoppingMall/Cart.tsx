import { useCallback } from "react";
import CartItemComponent from "./CartItem";
import CouponSelector from "./CouponSelector";
import OrderSummary from "./OrderSummary";
import { useCartStore } from "../../store/cartStore";
import { useCouponStore } from "../../store/couponStore";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const coupons = useCouponStore((state) => state.coupons);

  const selectedCoupon = useCouponStore((state) => state.selectedCoupon);
  const applyCoupon = useCouponStore((state) => state.applyCoupon);
  const setSelectedCoupon = useCouponStore((state) => state.setSelectedCoupon);

  const calculateItemTotal = useCartStore((state) => state.calculateItemTotal);
  const calculateCartTotal = useCartStore((state) => state.calculateCartTotal);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const completeOrder = useCartStore((state) => state.completeOrder);

  const totals = calculateCartTotal(selectedCoupon);
  const handleCompleteOrder = useCallback(() => {
    completeOrder(() => {
      setSelectedCoupon(null);
    });
  }, [completeOrder, setSelectedCoupon]);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItemComponent
                  key={item.product.id}
                  item={item}
                  calculateItemTotal={calculateItemTotal}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <CouponSelector
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              onApplyCoupon={(coupon) => applyCoupon(coupon, totals.totalBeforeDiscount)}
              onClearCoupon={() => setSelectedCoupon(null)}
            />
            <OrderSummary totals={totals} onCompleteOrder={handleCompleteOrder} />
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
