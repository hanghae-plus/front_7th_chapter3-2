import { CartItem, Product } from "../../types";

/**
 * 상품의 남은 재고를 계산하는 순수 함수
 * @param product 상품 정보
 * @param cart 장바구니 아이템 배열
 * @returns 남은 재고 수량
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 상품이 품절인지 확인하는 순수 함수
 * @param product 상품 정보
 * @param cart 장바구니 아이템 배열
 * @returns 품절 여부
 */
export const isOutOfStock = (product: Product, cart: CartItem[]): boolean => {
  return getRemainingStock(product, cart) <= 0;
};

/**
 * 특정 수량이 재고를 초과하는지 확인하는 순수 함수
 * @param product 상품 정보
 * @param quantity 확인할 수량
 * @param cart 장바구니 아이템 배열
 * @returns 재고 초과 여부
 */
export const exceedsStock = (product: Product, quantity: number): boolean => {
  return quantity > product.stock;
};
