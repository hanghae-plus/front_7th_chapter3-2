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

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export type NotificationType = 'error' | 'success' | 'warning';

export type NotificationFunction = (
  message: string,
  type: NotificationType
) => void;
