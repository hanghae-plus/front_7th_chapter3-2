export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

// UI 확장 타입
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}
