import type { CartItem, Product } from '../../types';

/**
 * 상품의 남은 재고를 계산합니다.
 *
 * @param product - 상품
 * @param cart - 장바구니 아이템 배열
 * @returns 남은 재고 수량
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 상품이 품절인지 확인합니다.
 *
 * @param product - 상품
 * @param cart - 장바구니 아이템 배열
 * @returns 품절이면 true
 */
export const isOutOfStock = (
  product: Product,
  cart: CartItem[]
): boolean => {
  return getRemainingStock(product, cart) <= 0;
};

/**
 * 상품을 재고 순으로 정렬합니다.
 *
 * @param products - 상품 배열
 * @returns 재고가 많은 순으로 정렬된 상품 배열
 */
export const sortByStock = <T extends Product>(products: T[]): T[] => {
  return [...products].sort((a, b) => b.stock - a.stock);
};
