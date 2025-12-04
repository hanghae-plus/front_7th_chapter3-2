import { ProductFormData } from '../../../types/products';

export const PRODUCT_VALIDATION_RULES = {
  price: {
    min: 0,
    errorMessages: {
      min: '가격은 0보다 커야 합니다'
    }
  },
  stock: {
    min: 0,
    max: 9999,
    errorMessages: {
      min: '재고는 0보다 커야 합니다',
      max: '재고는 9999개를 초과할 수 없습니다'
    }
  }
} as const;

export const initialForm: ProductFormData = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: []
} as const;
