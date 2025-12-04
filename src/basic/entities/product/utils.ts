/**
 * Product Entity - 계산 로직
 * 
 * 상품 관련 순수 함수 (비즈니스 로직)
 */

import { Product } from './model';
import { CartItem } from '../cart/model';

/**
 * 상품의 남은 재고 계산
 * (전체 재고 - 장바구니에 담긴 수량)
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  
  return remaining;
};

/**
 * 상품을 장바구니에 추가할 수 있는지 검증
 */
export const canAddToCart = (
  product: Product,
  cart: CartItem[]
): boolean => {
  return getRemainingStock(product, cart) > 0;
};

/**
 * 상품의 재고가 충분한지 검증
 */
export const hasEnoughStock = (
  product: Product,
  requestedQuantity: number,
  cart: CartItem[]
): boolean => {
  const remainingStock = getRemainingStock(product, cart);
  return remainingStock >= requestedQuantity;
};

/**
 * 상품 목록 검색 필터링
 */
export const filterProducts = (
  products: Product[],
  searchTerm: string
): Product[] => {
  if (!searchTerm) return products;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(lowerSearchTerm);
    const descriptionMatch = 'description' in product && 
      typeof (product as any).description === 'string' &&
      (product as any).description.toLowerCase().includes(lowerSearchTerm);
    
    return nameMatch || descriptionMatch;
  });
};
