import { Validation } from '@/shared/types';
import { Product } from '@/features/product/product.types';

export type CartValidationError =
  | 'CART_OUT_OF_STOCK'
  | 'COUPON_NOT_APPLICABLE'
  | 'PRODUCT_NOT_FOUND';
export type CartValidation = Validation<CartValidationError>;

export interface CartItem {
  product: Product;
  quantity: number;
}
