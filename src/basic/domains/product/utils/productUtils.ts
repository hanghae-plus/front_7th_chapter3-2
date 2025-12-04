import { CartItem, Product } from "../../../../types";

export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
}

type PriceFormatStyle = "symbol" | "text";

export function formatPrice(
  price: number,
  style: PriceFormatStyle = "text"
): string {
  if (style === "text") {
    return `${price.toLocaleString()}원`;
  }
  return `₩${price.toLocaleString()}`;
}

export function getMaxDiscountRate(product: Product): number {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map((d) => d.rate));
}
