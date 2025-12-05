import { useCallback, useEffect, useReducer } from 'react';
import { Coupon, Product } from '../../../../types';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';
import { CART_STORAGE_KEY } from '../config/cart-constants';
import { ProductWithUI } from '../../product';
import { cartReducer, initialCartState, CartState } from './cart-reducer';
import {
  cartActions,
  validateAddToCart,
  validateUpdateQuantity,
  validateApplyCoupon,
} from './cart-actions';
import { getRemainingStock } from './cart-utils';

export { calculateTotal } from './cart-utils';

export function useCart() {
  const [persistedCart, setPersistedCart] = useLocalStorage<CartState['items']>(
    CART_STORAGE_KEY,
    []
  );

  const [state, dispatch] = useReducer(cartReducer, {
    ...initialCartState,
    items: persistedCart,
  });

  // LocalStorage와 동기화
  useEffect(() => {
    setPersistedCart(state.items);
  }, [state.items, setPersistedCart]);

  /** 상품 추가 */
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      validateAddToCart(state, product);
      dispatch(cartActions.addItem(product));
    },
    [state]
  );

  /** 상품 삭제 */
  const removeFromCart = useCallback((productId: string) => {
    dispatch(cartActions.removeItem(productId));
  }, []);

  /** 수량 변경 */
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const item = state.items.find((item) => item.product.id === productId);
      if (!item) return;

      validateUpdateQuantity(item.product, newQuantity);
      dispatch(cartActions.updateQuantity(productId, newQuantity));
    },
    [state.items]
  );

  /** 쿠폰 적용 */
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      validateApplyCoupon(state, coupon);
      dispatch(cartActions.applyCoupon(coupon));
    },
    [state]
  );

  /** 장바구니 비우기 */
  const clearCart = useCallback(() => {
    dispatch(cartActions.clearCart());
  }, []);

  /** 특정 상품의 남은 재고 조회 */
  const getRemainingStockForProduct = useCallback(
    (product: Product): number => {
      return getRemainingStock(state.items, product);
    },
    [state.items]
  );

  return {
    cart: state.items,
    selectedCoupon: state.selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock: getRemainingStockForProduct,
    clearCart,
  };
}
