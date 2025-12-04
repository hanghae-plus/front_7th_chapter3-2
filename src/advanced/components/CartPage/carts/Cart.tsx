import { useCallback } from "react";
import { Coupon } from "../../../types/types";
import SectionCoupon from "./SectionCoupon";
import SectionPayment from "./SectionPayment";
import { getRemainingStock } from "../../../utils/product";
import { calculateCartTotal } from "../../../utils/cart";
import { IconShoppingBag } from "../../icons/IconShoppingBag";
import { IconShoppingBagEmpty } from "../../icons/IconShoppingBagEmpty";
import CartItemRow from "./CartItem";
import { useNotificationStore } from "../../../stores/useNotificationStore";
import { useProductStore } from "../../../stores/useProductStore";
import { useCartStore } from "../../../stores/useCartStore";

interface CartProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
}

export const Cart = ({
  coupons,
  selectedCoupon,
  setSelectedCoupon,
}: CartProps) => {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, calculateCartTotal]
  );

  // 주문
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IconShoppingBag />
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <IconShoppingBagEmpty />
              <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                return <CartItemRow key={item.product.id} item={item} />;
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            {/* 쿠폰 할인 세션 */}
            <SectionCoupon
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              applyCoupon={applyCoupon}
            />

            {/* 결제 정보 세션 */}
            <SectionPayment
              totals={calculateCartTotal(cart, selectedCoupon)}
              completeOrder={completeOrder}
            />
          </>
        )}
      </div>
    </div>
  );
};
