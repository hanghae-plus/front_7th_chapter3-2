import { CartItem, Coupon } from '../../../../types';
import { ProductWithUI } from '../../product';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from './cart-utils';

export const CART_ACTIONS = {
  ADD_ITEM: 'cart/ADD_ITEM',
  REMOVE_ITEM: 'cart/REMOVE_ITEM',
  UPDATE_QUANTITY: 'cart/UPDATE_QUANTITY',
  APPLY_COUPON: 'cart/APPLY_COUPON',
  CLEAR_CART: 'cart/CLEAR_CART',
  SET_CART: 'cart/SET_CART',
} as const;

export type CartAction =
  | { type: typeof CART_ACTIONS.ADD_ITEM; payload: { product: ProductWithUI } }
  | { type: typeof CART_ACTIONS.REMOVE_ITEM; payload: { productId: string } }
  | {
      type: typeof CART_ACTIONS.UPDATE_QUANTITY;
      payload: { productId: string; quantity: number };
    }
  | { type: typeof CART_ACTIONS.APPLY_COUPON; payload: { coupon: Coupon } }
  | { type: typeof CART_ACTIONS.CLEAR_CART }
  | { type: typeof CART_ACTIONS.SET_CART; payload: { cart: CartItem[] } };

export interface CartState {
  items: CartItem[];
  selectedCoupon: Coupon | null;
}

export const initialCartState: CartState = {
  items: [],
  selectedCoupon: null,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // 상품 추가
    case CART_ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      return {
        ...state,
        items: addItemToCart(state.items, product),
      };
    }

    // 상품 삭제
    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      return {
        ...state,
        items: removeItemFromCart(state.items, productId),
      };
    }

    // 상품 수량 변경
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      return {
        ...state,
        items: updateCartItemQuantity(state.items, productId, quantity),
      };
    }

    // 쿠폰 적용
    case CART_ACTIONS.APPLY_COUPON: {
      const { coupon } = action.payload;
      return {
        ...state,
        selectedCoupon: coupon,
      };
    }

    // 장바구니 비우기
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        selectedCoupon: null,
      };
    }

    // 장바구니 설정
    case CART_ACTIONS.SET_CART: {
      const { cart } = action.payload;
      return {
        ...state,
        items: cart,
      };
    }

    default:
      return state;
  }
}
