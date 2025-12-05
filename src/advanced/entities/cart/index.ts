// Hooks
export { useCart, calculateTotal } from './model/use-cart';

// UI Components
export { CartItem } from './ui/cart-item';

// Model exports for advanced usage
export type { CartState, CartAction } from './model/cart-reducer';
export {
  cartReducer,
  initialCartState,
  CART_ACTIONS,
} from './model/cart-reducer';
export { cartActions } from './model/cart-actions';

// Utils
export * from './model/cart-utils';
