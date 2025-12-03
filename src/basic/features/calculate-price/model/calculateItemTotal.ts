import { CartItem } from "../../../types";
import { getMaxApplicableDiscount } from "./getMaxApplicableDiscount";

export const calculateItemTotal = (
  cart: CartItem[],
  item: CartItem
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(cart, item);

  return Math.round(price * quantity * (1 - discount));
};
