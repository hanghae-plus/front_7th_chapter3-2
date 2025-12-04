import { CartItem } from "../../../../types";

export function hasBulkPurchase(cart: CartItem[]): boolean {
  return cart.some((item) => item.quantity >= 10);
}

