import { CartItem, Product } from "../types";
import { calculateRemainingStock } from "./calculateRemainingStock";

export const isSoldOut = (product: Product, cart: CartItem[]): boolean => {
  return calculateRemainingStock(product, cart) <= 0;
};
