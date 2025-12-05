import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { CartItemList } from "./CartItemList";
import { OrderCouponSection } from "./OrderCouponSection";
import { OrderSummary } from "./OrderSummary";
import { EmptyCartIcon, ShoppingBagIcon } from "../../../components/icons";
import { cartAtom, cartTotalsAtom, selectedCouponAtom } from "../../../atoms";
import { useCart } from "../../../hooks/useCart";

interface CartSectionProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const CartSection = ({ addNotification }: CartSectionProps) => {
  // Jotai atoms 직접 사용
  const cart = useAtomValue(cartAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const totals = useAtomValue(cartTotalsAtom);

  // useCart hook에서 필요한 함수만 가져오기
  const cartActions = useCart({
    onMessage: addNotification,
  });

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    cartActions.clearCart();
  }, [addNotification, cartActions]);

  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingBagIcon className="w-5 h-5 mr-2" />
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <EmptyCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <CartItemList
            cartItems={cart}
            onRemove={cartActions.remove}
            onUpdateQuantity={cartActions.updateQuantity}
          />
        )}
      </section>

      {cart.length > 0 && (
        <>
          <OrderCouponSection
            selectedCoupon={selectedCoupon}
            onApply={cartActions.apply}
            onClear={cartActions.clearSelectedCoupon}
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
