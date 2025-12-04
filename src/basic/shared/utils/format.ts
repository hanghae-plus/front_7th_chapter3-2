/**
 * Shared Utils - 포맷팅 함수
 * 
 * 화면에 표시되는 데이터 포맷팅 유틸리티
 */

import { Product } from '../../entities/product/model';
import { CartItem } from '../../entities/cart/model';
import { getRemainingStock } from '../../entities/product/utils';

/**
 * 가격 포맷팅
 * - 관리자 모드: "10,000원"
 * - 사용자 모드: "₩10,000"
 * - 품절 상품: "SOLD OUT"
 */
export const formatPrice = (
  price: number,
  isAdmin: boolean,
  product?: Product,
  cart?: CartItem[]
): string => {
  if (product && cart) {
    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      return 'SOLD OUT';
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  
  return `₩${price.toLocaleString()}`;
};

/**
 * 할인율 포맷팅
 * 예: 0.1 → "10%"
 */
export const formatDiscount = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};

/**
 * 주문 번호 생성
 */
export const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}`;
};
