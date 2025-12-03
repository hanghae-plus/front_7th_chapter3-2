import { type FC } from "react";
import CartItems from "../../components/cartPage/CartItems";
import PayItem from "../../components/cartPage/PayItem";
import ShoppingBagIcon from "../../components/_icons/ShoppingBagIcon";
import { useCoupons } from "../../hooks/useCoupons";
import CouponSelector from "../../components/cartPage/CouponSelector";
import { calculateCartTotal } from "../../models/cart";
import { CartItem } from "../../../types";

interface IProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  emptyCart: () => void;
}

const CartSummary: FC<IProps> = ({
  cart,
  removeFromCart,
  updateQuantity,
  emptyCart,
}) => {
  const {
    coupons,
    applyCoupon,
    selectedCoupon,
    setSelectedCoupon,
    removeCoupon,
  } = useCoupons();

  const totals = calculateCartTotal(cart, selectedCoupon);

  const handleCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    alert(`주문이 완료되었습니다. 주문번호: ${orderNumber}`);
    emptyCart();
    removeCoupon();
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
            setSelectedCoupon={setSelectedCoupon}
          />
          <PayItem totals={totals} onCheckout={handleCompleteOrder} />
        </>
      )}
    </div>
  );
};

export default CartSummary;
