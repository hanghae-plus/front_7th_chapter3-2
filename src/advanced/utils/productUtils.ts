import { Product, CartItem } from '../../types';

/**
 * 상품의 남은 재고 계산
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 가격을 원화 기호로 포맷팅 (일반 사용자용)
 */
export const formatCurrency = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 가격을 원 단위로 포맷팅 (관리자용)
 */
export const formatCurrencyWon = (price: number): string => {
  return `${price.toLocaleString()}원`;
};
