import {
  findProductById,
  Product,
  ProductValidation,
} from '@/features/product';

export const validateSetProductPrice = (value: number): ProductValidation => {
  if (value < 0)
    return {
      valid: false,
      error: 'INVALID_PRICE',
      message: '가격은 0보다 커야 합니다',
    };
  return { valid: true, error: null, message: '' };
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
  return { valid: true, error: null, message: '' };
};

export const validateAddProduct = (
  _products: Product[],
  newProduct: Omit<Product, 'id'>
): ProductValidation => {
  // 가격 검증
  const priceValidation = validateSetProductPrice(newProduct.price);
  if (!priceValidation.valid) return priceValidation;

  // 재고 검증
  const stockValidation = validationSetStock(newProduct.stock);
  if (!stockValidation.valid) return stockValidation;

  return { valid: true, error: null, message: '상품이 추가되었습니다.' };
};

export const validateUpdateProduct = (
  products: Product[],
  productId: string,
  updates: Partial<Product>
): ProductValidation => {
  // 존재 여부 확인
  const existingProduct = findProductById(products, productId);
  if (!existingProduct)
    return {
      valid: false,
      error: 'NOT_FOUND',
      message: '존재하지 않는 상품입니다.',
    };

  // 가격이 업데이트되면 검증
  if (updates.price !== undefined) {
    const priceValidation = validateSetProductPrice(updates.price);
    if (!priceValidation.valid) return priceValidation;
  }

  // 재고가 업데이트되면 검증
  if (updates.stock !== undefined) {
    const stockValidation = validationSetStock(updates.stock);
    if (!stockValidation.valid) return stockValidation;
  }

  return { valid: true, error: null, message: '상품이 수정되었습니다.' };
};

export const validateRemoveCartItem = (
  products: Product[],
  productId: string
): ProductValidation => {
  const existingProduct = findProductById(products, productId);
  if (!existingProduct)
    return {
      valid: false,
      error: 'NOT_FOUND',
      message: '존재하지 않는 상품입니다.',
    };
  return { valid: true, error: null, message: '상품이 삭제되었습니다.' };
};
