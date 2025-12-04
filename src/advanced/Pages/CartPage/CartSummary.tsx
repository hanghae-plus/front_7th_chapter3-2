import { type FC } from "react";
import CartItems from "../../components/cartPage/CartItems";
import PayItem from "../../components/cartPage/PayItem";
import ShoppingBagIcon from "../../components/_icons/ShoppingBagIcon";
import CouponSelector from "../../components/cartPage/CouponSelector";
import { calculateCartTotal } from "../../models/cart";
import { CartItem, Coupon } from "../../../types";
import { Notification } from "../../models/notificiation";

interface IProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon | null) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  emptyCart: () => void;
  addNotification: (message: string, type: Notification["type"]) => void;
}

const CartSummary: FC<IProps> = ({
  cart,
  coupons,
  selectedCoupon,
  applyCoupon,
  removeFromCart,
  updateQuantity,
  emptyCart,
  addNotification,
}) => {
  const totals = calculateCartTotal(cart, selectedCoupon);

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
