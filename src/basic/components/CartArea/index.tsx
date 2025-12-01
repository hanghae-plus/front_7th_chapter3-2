import { type FC } from "react";
import CartItems from "./CartItems";
import CouponItem from "./CouponItem";
import PayItem from "./PayItem";
import { CartItem, Coupon } from "../../../types";
import ShoppingBagIcon from "../icons/ShoppingBagIcon";

interface IProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  calculateItemTotal: (item: CartItem) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  completeOrder: () => void;
}

const CartArea: FC<IProps> = ({
  cart,
  coupons,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon,
  totals,
  calculateItemTotal,
  completeOrder,
  removeFromCart,
  updateQuantity,
}) => {
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
            calculateItemTotal={calculateItemTotal}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponItem
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
          <PayItem totals={totals} completeOrder={completeOrder} />
        </>
      )}
    </div>
  );
};

export default CartArea;
