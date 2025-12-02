import { Product, Validation } from '@/basic/types';

export type CartValidationError =
  | 'CART_OUT_OF_STOCK'
  | 'COUPON_NOT_APPLICABLE'
  | 'PRODUCT_NOT_FOUND';
export type CartValidation = Validation<CartValidationError>;

export interface CartItem {
  product: Product;
  quantity: number;
}
