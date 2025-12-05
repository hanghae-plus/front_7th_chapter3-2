import { useAtomValue, useSetAtom } from 'jotai';
import {
  cartAtom,
  selectedCouponAtom,
  totalItemCountAtom,
  cartTotalsAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  applyCouponAtom,
  clearCartAtom,
} from '@/features/cart/store/cart.atom';
import { getRemainingStock, CartValidation } from '@/features/cart';
import { Coupon } from '@/features/coupon';
import { Product } from '@/features/product';
import { useCallback } from 'react';

export function useCartStore() {
  const cart = useAtomValue(cartAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const totals = useAtomValue(cartTotalsAtom);

  const setAddToCart = useSetAtom(addToCartAtom);
  const setRemoveFromCart = useSetAtom(removeFromCartAtom);
  const setUpdateQuantity = useSetAtom(updateQuantityAtom);
  const setApplyCoupon = useSetAtom(applyCouponAtom);
  const setClearCart = useSetAtom(clearCartAtom);

  const addToCart = useCallback(
    (
      product: Product,
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      }
    ) => {
      setAddToCart({ product, options });
    },
    [setAddToCart]
  );

  const removeFromCart = useCallback(
    (
      productId: string,
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      }
    ) => {
      setRemoveFromCart({ productId, options });
    },
    [setRemoveFromCart]
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number,
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      }
    ) => {
      setUpdateQuantity({ productId, newQuantity, options });
    },
    [setUpdateQuantity]
  );

  const applyCoupon = useCallback(
    (
      coupon: Coupon,
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      }
    ) => {
      setApplyCoupon({ coupon, options });
    },
    [setApplyCoupon]
  );

  const clearCart = useCallback(() => {
    setClearCart();
  }, [setClearCart]);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    totals,
    totalItemCount,
    getRemainingStock,
  };
}
