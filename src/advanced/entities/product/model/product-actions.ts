import { ProductWithUI } from './product-interface';
import { PRODUCT_ACTIONS, ProductAction } from './product-reducer';
import {
  generateProductId,
  isValidProduct,
  isValidProductPrice,
  isValidProductStock,
} from './product-utils';

/** Action Creators */
export const productActions = {
  /** 새 상품 추가 액션 생성 */
  addProduct: (productData: Omit<ProductWithUI, 'id'>): ProductAction => {
    const product: ProductWithUI = {
      ...productData,
      id: generateProductId(),
    };

    return {
      type: PRODUCT_ACTIONS.ADD_PRODUCT,
      payload: { product },
    };
  },

  /** 상품 수정 액션 생성 */
  updateProduct: (
    productId: string,
    updates: Partial<ProductWithUI>
  ): ProductAction => ({
    type: PRODUCT_ACTIONS.UPDATE_PRODUCT,
    payload: { productId, updates },
  }),

  /** 상품 삭제 액션 생성 */
  deleteProduct: (productId: string): ProductAction => ({
    type: PRODUCT_ACTIONS.DELETE_PRODUCT,
    payload: { productId },
  }),

  /** 상품 목록 설정 액션 생성 */
  setProducts: (products: ProductWithUI[]): ProductAction => ({
    type: PRODUCT_ACTIONS.SET_PRODUCTS,
    payload: { products },
  }),
};

/** 상품 추가 시 유효성 검증 */
export const validateAddProduct = (
  productData: Omit<ProductWithUI, 'id'>
): void => {
  if (!productData.name || productData.name.trim() === '') {
    throw new Error('상품명을 입력해주세요.');
  }

  if (!isValidProduct({ ...productData, id: 'temp' })) {
    throw new Error('유효하지 않은 상품 정보입니다.');
  }
};

/** 상품 수정 시 유효성 검증 */
export const validateUpdateProduct = (
  updates: Partial<ProductWithUI>
): void => {
  if (updates.name !== undefined && updates.name.trim() === '') {
    throw new Error('상품명은 비어있을 수 없습니다.');
  }

  if (updates.price !== undefined && !isValidProductPrice(updates.price)) {
    throw new Error('가격은 0보다 커야 합니다.');
  }

  if (updates.stock !== undefined && !isValidProductStock(updates.stock)) {
    throw new Error('재고는 0 이상이어야 합니다.');
  }
};
