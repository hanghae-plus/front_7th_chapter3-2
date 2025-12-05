import { useMemo } from "react";
import { CartItem } from "../../../../types";
import {
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_BONUS_RATE,
  MAX_DISCOUNT_RATE,
} from "../../../lib/constants";
import { useStore } from "../../../shared/stores/store";

export function useCartCalculations() {
  const cart = useStore((state) => state.cart);
  const selectedCoupon = useStore((state) => state.selectedCoupon);

  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some(
      (cartItem) => cartItem.quantity >= BULK_PURCHASE_THRESHOLD
    );
    if (hasBulkPurchase) {
      return Math.min(
        baseDiscount + BULK_PURCHASE_BONUS_RATE,
        MAX_DISCOUNT_RATE
      );
    }

    return baseDiscount;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  const totals = useMemo(() => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  }, [cart, selectedCoupon]);

  return {
    calculateItemTotal,
    totals,
  };
}
