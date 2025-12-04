/**
 * Cart Entity - 타입 정의
 * 
 * 장바구니 관련 도메인 타입
 */

import { Product } from '../product/model';

export interface CartItem {
  product: Product;
  quantity: number;
}
