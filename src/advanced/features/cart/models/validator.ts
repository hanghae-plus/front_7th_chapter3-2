import {
  calculateCartTotal,
  findItemFromCartById,
  getRemainingStock,
} from '@/features/cart/models';
import { CartItem, CartValidation } from '@/features/cart/cart.types';
import { Coupon } from '@/features/coupon';
import { Product } from '@/features/product';
import { isValidStock } from '@/shared/utils/validators';

/**
 * 상품을 장바구니에 추가할 수 있는지 검증
 * - 상품 재고가 충분한지 확인
 * - 이미 장바구니에 있다면 수량 증가 가능 여부 확인
 */
export const validateAddCartItem = (
  cart: CartItem[],
  product: Product
): CartValidation => {
  const remainingStock = getRemainingStock(cart, product);

  // 재고 부족 체크
  if (!isValidStock(remainingStock)) {
    return {
      valid: false,
      error: 'CART_OUT_OF_STOCK',
      message: '재고가 부족합니다!',
    };
  }

  const existingItem = findItemFromCartById(cart, product.id);

  // 이미 장바구니에 있는 상품이면 +1 수량 체크
  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      return {
        valid: false,
        error: 'CART_OUT_OF_STOCK',
        message: `재고는 ${product.stock}개까지만 있습니다.`,
      };
    }
  }

  return {
    valid: true,
    error: null,
    message: '장바구니에 담았습니다',
  };
};

/**
 * 장바구니 상품의 수량을 변경할 수 있는지 검증
 * - 장바구니에 해당 상품이 존재하는지 확인
 * - 새 수량이 재고를 초과하지 않는지 확인
 * - 0 이하면 삭제 검증으로 위임
 */
export const validateUpdateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartValidation => {
  // 수량이 0 이하면 삭제 검증으로 위임
  if (newQuantity <= 0) {
    return validateRemoveCartItem(cart, productId);
  }

  // 상품 존재 여부 체크
  const cartItem = findItemFromCartById(cart, productId);

  if (!cartItem) {
    return {
      valid: false,
      error: 'PRODUCT_NOT_FOUND',
      message: '장바구니에 해당 상품이 없습니다',
    };
  }

  if (newQuantity > cartItem.quantity) {
    if (newQuantity > cartItem.product.stock) {
      return {
        valid: false,
        error: 'CART_OUT_OF_STOCK',
        message: `재고는 ${cartItem.product.stock}개까지만 있습니다.`,
      };
    }
    return {
      valid: true,
      error: null,
      message: '장바구니에 담았습니다',
    };
  }

  return {
    valid: true,
    error: null,
    message: '장바구니 상품 수량이 변경되었습니다',
  };
};

/**
 * 장바구니에서 상품을 삭제할 수 있는지 검증
 * - 장바구니에 해당 상품이 존재하는지 확인
 */
export const validateRemoveCartItem = (
  cart: CartItem[],
  productId: string
): CartValidation => {
  const cartItem = findItemFromCartById(cart, productId);

  if (!cartItem) {
    return {
      valid: false,
      error: 'PRODUCT_NOT_FOUND',
      message: '장바구니에 해당 상품이 없습니다',
    };
  }

  return { valid: true, error: null, message: '장바구니에서 삭제되었습니다' };
};

/**
 * 쿠폰을 장바구니에 적용할 수 있는지 검증
 * - percentage 쿠폰은 최소 구매 금액 체크
 */
export const validateApplyCoupon = (
  cart: CartItem[],
  coupon: Coupon
): CartValidation => {
  // percentage 쿠폰의 최소 구매 금액 체크
  if (coupon.discountType === 'percentage') {
    const { totalBeforeDiscount } = calculateCartTotal(cart);

    if (totalBeforeDiscount < 10000) {
      return {
        valid: false,
        error: 'COUPON_NOT_APPLICABLE',
        message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
      };
    }
  }

  return {
    valid: true,
    error: null,
    message: '쿠폰이 적용되었습니다.',
  };
};
