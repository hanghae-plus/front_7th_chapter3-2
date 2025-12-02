import {
  calculateCartTotal,
  findProductFromCartById,
  getRemainingStock,
} from '@/basic/models/cart';
import { CartItem, CartValidation, Coupon, Product } from '@/types';
import { isValidStock } from '@/utils/validators';

export const validateAddCart = (
  cart: CartItem[],
  product: Product
): CartValidation => {
  const remainingStock = getRemainingStock(cart, product);
  if (!isValidStock(remainingStock))
    return {
      valid: false,
      error: 'CART_OUT_OF_STOCK',
      message: '재고가 부족합니다!',
    };

  const existingItem = findProductFromCartById(cart, product.id);
  if (existingItem) {
    const maxStock = existingItem.product.stock;
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > maxStock)
      return {
        valid: false,
        error: 'CART_OUT_OF_STOCK',
        message: `재고는 ${maxStock}개까지만 있습니다.`,
      };
  }

  return { valid: true, error: null };
};

export const validateRemoveCart = (
  cart: CartItem[],
  productId: string
): CartValidation => {
  const existingItem = findProductFromCartById(cart, productId);
  if (!existingItem)
    return {
      valid: false,
      error: 'PRODUCT_NOT_FOUND',
      message: '존재하지 않는 상품입니다.',
    };
  return { valid: true, error: null };
};

export const validateApplyCoupon = (
  cart: CartItem[],
  coupon: Coupon
): CartValidation => {
  const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;
  if (currentTotal < 10000 && coupon.discountType === 'percentage') {
    return {
      valid: false,
      error: 'COUPON_NOT_APPLICABLE',
      message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
    };
  }
  return { valid: true, error: null };
};
