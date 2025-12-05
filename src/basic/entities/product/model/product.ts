import { PRODUCT_ID_PREFIX } from '../config';
import { Product } from './types';

export const createProduct = (data: Omit<Product, 'id'>): Product => {
  return {
    ...data,
    // crypto.randomUUID()로 고유 ID 생성 (충돌 방지)
    id: `${PRODUCT_ID_PREFIX}${crypto.randomUUID()}`,
  };
};
