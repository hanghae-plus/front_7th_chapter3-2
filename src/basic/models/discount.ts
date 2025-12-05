import { CartItem, Coupon } from "../../types";

export const getMaxApplicableDiscount = (
  cart: CartItem[],
  item: CartItem
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

export const calculateCouponDiscount = (
  total: number,
  coupon: Coupon
): number => {
  if (coupon.discountType === "amount") {
    return coupon.discountValue;
  } else {
    return Math.round(total * (coupon.discountValue / 100));
  }
};
