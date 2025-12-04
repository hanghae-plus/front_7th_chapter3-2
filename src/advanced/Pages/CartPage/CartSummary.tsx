import { type FC } from "react";
import CartItems from "../../components/cartPage/CartItems";
import PayItem from "../../components/cartPage/PayItem";
import ShoppingBagIcon from "../../components/_icons/ShoppingBagIcon";
import CouponSelector from "../../components/cartPage/CouponSelector";
import { useCart } from "../../hooks/useCart";
import { useCoupons } from "../../hooks/useCoupons";
import { useAddNotification } from "../../hooks/useNotification";

const CartSummary: FC = () => {
  const {
    cart,
    selectedCoupon,
    applyCoupon,
    removeFromCart,
    updateQuantity,
    emptyCart,
    calculateTotal,
  } = useCart();
  
  const { coupons } = useCoupons();
  const addNotification = useAddNotification();
  const totals = calculateTotal();

  const handleCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    emptyCart();
  };

  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingBagIcon />
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <CartItems
            cart={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onApply={applyCoupon}
          />
          <PayItem totals={totals} onCheckout={handleCompleteOrder} />
        </>
      )}
    </div>
  );
};

export default CartSummary;
