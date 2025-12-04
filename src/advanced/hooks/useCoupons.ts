import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../store/atoms/couponsAtom";
import { cartAtom } from "../store/atoms/cartAtom";
import { calculateCartTotal } from "../models/cart";
import { Coupon } from "../../types";
import { MESSAGES, BUSINESS_RULES } from "../constants";
import { useNotification } from "./useNotification";

export const useCoupons = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const cart = useAtomValue(cartAtom);
  const { addNotification } = useNotification();

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      let notificationMessage = "";
      let notificationType: "error" | "success" = "success";

      setCoupons((prev) => {
        const existingCoupon = prev.find((c) => c.code === newCoupon.code);
        if (existingCoupon) {
          notificationMessage = MESSAGES.COUPON_CODE_EXISTS;
          notificationType = "error";
          return prev;
        }
        notificationMessage = MESSAGES.COUPON_ADDED;
        return [...prev, newCoupon];
      });

      if (notificationMessage) {
        addNotification(notificationMessage, notificationType);
      }
    },
    [setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification(MESSAGES.COUPON_DELETED, "success");
    },
    [selectedCoupon, setCoupons, setSelectedCoupon, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (
        currentTotal < BUSINESS_RULES.MIN_PURCHASE_FOR_PERCENTAGE_COUPON &&
        coupon.discountType === "percentage"
      ) {
        addNotification(MESSAGES.PERCENTAGE_COUPON_MIN_PURCHASE, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification(MESSAGES.COUPON_APPLIED, "success");
    },
    [cart, setSelectedCoupon, addNotification]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  };
};
