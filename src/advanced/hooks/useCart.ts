import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import type { CartItem, Product } from '../../types';
import {
  cartAtom,
  cartTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  getRemainingStock as calcRemainingStock,
  getItemTotal as calcItemTotal
} from '../atoms';
import type { CartTotal } from '../models';

/**
 * useCart 훅 반환 타입
 */
export interface UseCartReturn {
  cart: CartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => CartTotal;
  getRemainingStock: (product: Product) => number;
  getItemTotal: (item: CartItem) => number;
}

/**
 * 장바구니 관리 훅 (Jotai adapter)
 *
 * 기존 인터페이스를 유지하면서 내부적으로 Jotai atom 사용
 * 더 이상 selectedCoupon을 파라미터로 받지 않음 (전역 상태에서 직접 참조)
 *
 * @returns 장바구니 상태와 액션들
 */
export const useCart = (): UseCartReturn => {
  const cart = useAtomValue(cartAtom);
  const cartTotal = useAtomValue(cartTotalAtom);
  const addToCartAction = useSetAtom(addToCartAtom);
  const removeFromCartAction = useSetAtom(removeFromCartAtom);
  const updateQuantityAction = useSetAtom(updateQuantityAtom);
  const clearCartAction = useSetAtom(clearCartAtom);

  const addToCart = useCallback(
    (product: Product): boolean => {
      const remainingStock = calcRemainingStock(product, cart);
      if (remainingStock <= 0) {
        return false;
      }
      addToCartAction(product);
      return true;
    },
    [cart, addToCartAction]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeFromCartAction(productId);
    },
    [removeFromCartAction]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantityAction({ productId, newQuantity });
    },
    [updateQuantityAction]
  );

  const clearCart = useCallback(() => {
    clearCartAction();
  }, [clearCartAction]);

  const getCartTotal = useCallback((): CartTotal => {
    return cartTotal;
  }, [cartTotal]);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      return calcRemainingStock(product, cart);
    },
    [cart]
  );

  const getItemTotal = useCallback(
    (item: CartItem): number => {
      return calcItemTotal(item, cart);
    },
    [cart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getRemainingStock,
    getItemTotal
  };
};
