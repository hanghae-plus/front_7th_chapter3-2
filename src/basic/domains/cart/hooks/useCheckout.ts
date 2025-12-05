import { useCallback } from "react";
import { Coupon } from "../../../types";

export function useCheckout(
  clearCart: () => void,
  clearCoupon: () => void,
  onNotify: (message: string, type: "success") => void
) {
  const handleCheckout = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    onNotify(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    clearCoupon();
  }, [clearCart, clearCoupon, onNotify]);

  return { handleCheckout };
}
