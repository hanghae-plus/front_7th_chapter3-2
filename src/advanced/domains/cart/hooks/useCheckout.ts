import { useCallback } from "react";
import { useStore } from "../../../shared/stores/store";

export function useCheckout() {
  const clearCart = useStore((state) => state.clearCart);
  const clearCoupon = useStore((state) => state.clearCoupon);
  const addNotification = useStore((state) => state.addNotification);

  const handleCheckout = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    clearCoupon();
  }, [clearCart, clearCoupon, addNotification]);

  return { handleCheckout };
}
