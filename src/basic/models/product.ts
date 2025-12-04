import { Product } from '../types/products';

/**
 * 상품의 최대 할인율을 계산합니다 (백분율).
 */
export const getMaxDiscountRate = (product: Product): number => {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map(d => d.rate)) * 100;
};

/**
 * 상품의 첫 번째 할인 정보를 반환합니다.
 */
export const getFirstDiscount = (product: Product): { quantity: number; rate: number } | null => {
  if (product.discounts.length === 0) return null;
  return product.discounts[0];
};

