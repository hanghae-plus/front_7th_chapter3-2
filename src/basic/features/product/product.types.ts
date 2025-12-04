import { Validation } from '@/shared/types';

export type ProductValidationError =
  | 'INVALID_PRICE'
  | 'INVALID_STOCK'
  | 'DUPLICATED'
  | 'NOT_FOUND';

export type ProductValidation = Validation<ProductValidationError>;

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
  description?: string;
  isRecommended?: boolean;
}

export interface Discount {
  quantity: number;
  rate: number;
}
