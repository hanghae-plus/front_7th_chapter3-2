import { CartItem, Coupon } from "../../../../types";
import { CartItemList } from "./CartItemList";
import { OrderCouponSection } from "./OrderCouponSection";
import { OrderSummary } from "./OrderSummary";
import { EmptyCartIcon, ShoppingBagIcon } from "../../../components/icons";

interface CartSectionProps {
  cart: {
    value: CartItem[];
    remove: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    apply: (coupon: Coupon) => void;
    clearSelectedCoupon: () => void;
    selectedCoupon: Coupon | null;
  };
  coupons: {
    value: Coupon[];
  };
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
}

export const CartSection = ({
  cart,
  coupons,
  totals,
  completeOrder,
}: CartSectionProps) => {
  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingBagIcon className="w-5 h-5 mr-2" />
          장바구니
        </h2>
        {cart.value.length === 0 ? (
          <div className="text-center py-8">
            <EmptyCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <CartItemList
            cartItems={cart.value}
            onRemove={cart.remove}
            onUpdateQuantity={cart.updateQuantity}
          />
        )}
      </section>

      {cart.value.length > 0 && (
        <>
          <OrderCouponSection
            coupons={coupons.value}
            selectedCoupon={cart.selectedCoupon}
            onApply={cart.apply}
            onClear={cart.clearSelectedCoupon}
          />

          <OrderSummary
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            onOrder={completeOrder}
          />
        </>
      )}
    </div>
  );
};
