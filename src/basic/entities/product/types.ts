import { Product } from '../../../types';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface ProductFormState {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<DiscountFormState>;
}

export interface DiscountFormState {
  quantity: number;
  rate: number;
}
