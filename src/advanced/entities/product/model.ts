/**
 * Product Entity - 타입 정의
 * 
 * 상품 관련 도메인 타입
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface ProductWithUI extends Product {
  showAddProductForm: boolean;
  editingProductId: string | null;
}

export interface Discount {
  quantity: number;
  rate: number;
}
