import { ProductValidation } from '@/types';

export const validateSetProductPrice = (value: number): ProductValidation => {
  if (value < 0)
    return {
      valid: false,
      error: 'INVALID_PRICE',
      message: '가격은 0보다 커야 합니다',
    };
  return { valid: true, error: null };
};

export const validationSetStock = (value: number): ProductValidation => {
  if (value < 0) {
    return {
      valid: false,
      error: 'INVALID_STOCK',
      message: '재고는 0보다 커야 합니다',
    };
  }
  if (value > 9999) {
    return {
      valid: false,
      error: 'INVALID_STOCK',
      message: '재고는 9999개를 초과할 수 없습니다',
    };
  }
  return { valid: true, error: null };
};
