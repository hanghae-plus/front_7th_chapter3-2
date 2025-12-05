import { Coupon } from '../../../../types';
import { ProductWithUI } from '../../product';
import { CART_ACTIONS, CartAction, CartState } from './cart-reducer';
import { getRemainingStock, canApplyCoupon } from './cart-utils';

// Action Creators
export const cartActions = {
  addItem: (product: ProductWithUI): CartAction => ({
    type: CART_ACTIONS.ADD_ITEM,
    payload: { product },
  }),

  removeItem: (productId: string): CartAction => ({
    type: CART_ACTIONS.REMOVE_ITEM,
    payload: { productId },
  }),

  updateQuantity: (productId: string, quantity: number): CartAction => ({
    type: CART_ACTIONS.UPDATE_QUANTITY,
    payload: { productId, quantity },
  }),

  applyCoupon: (coupon: Coupon): CartAction => ({
    type: CART_ACTIONS.APPLY_COUPON,
    payload: { coupon },
  }),

  clearCart: (): CartAction => ({
    type: CART_ACTIONS.CLEAR_CART,
  }),

  setCart: (cart: CartState['items']): CartAction => ({
    type: CART_ACTIONS.SET_CART,
    payload: { cart },
  }),
};

export const validateAddToCart = (
  state: CartState,
  product: ProductWithUI
): void => {
  const remainingStock = getRemainingStock(state.items, product);

  if (remainingStock <= 0) {
    throw new Error('재고가 부족합니다!');
  }

  if (remainingStock < 1) {
    throw new Error(`재고는 ${product.stock}개까지만 있습니다.`);
  }
};

export const validateUpdateQuantity = (
  product: ProductWithUI,
  newQuantity: number
): void => {
  if (newQuantity > product.stock) {
    throw new Error(`재고는 ${product.stock}개까지만 있습니다.`);
  }

  if (newQuantity < 0) {
    throw new Error('수량은 0개 이상이어야 합니다.');
  }
};

export const validateApplyCoupon = (state: CartState, coupon: Coupon): void => {
  if (!canApplyCoupon(state.items, coupon, state.selectedCoupon)) {
    throw new Error('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.');
  }
};
