import { Product } from '../entities/product/model/types.ts';

export interface CartItem {
  product: Product;
  quantity: number;
}