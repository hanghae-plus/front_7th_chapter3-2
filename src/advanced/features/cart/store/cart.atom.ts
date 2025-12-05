import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  addItemToCart,
  calculateCartTotal,
  CartItem,
  CartValidation,
  findItemFromCartById,
  removeItemFromCart,
  updateItemQuantity,
  validateAddCartItem,
  validateApplyCoupon,
  validateRemoveCartItem,
  validateUpdateCartItemQuantity,
} from '@/features/cart';
import { Coupon } from '@/features/coupon';
import { Product } from '@/features/product';

// Base atoms
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);
export const selectedCouponAtom = atom<Coupon | null>(null);

// Derived atoms
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const cartTotalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

// Action atoms
export const addToCartAtom = atom(
  null,
  (
    get,
    set,
    {
      product,
      options,
    }: {
      product: Product;
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      };
    }
  ) => {
    const cart = get(cartAtom);
    const validation = validateAddCartItem(cart, product);

    if (!validation.valid) {
      options?.onError?.(validation);
      return;
    }

    set(cartAtom, (prevCart) => {
      const existingItem = findItemFromCartById(prevCart, product.id);
      if (existingItem) {
        return updateItemQuantity(
          prevCart,
          product.id,
          existingItem.quantity + 1
        );
      }
      return addItemToCart(prevCart, product);
    });

    options?.onSuccess?.(validation);
  }
);

export const removeFromCartAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      options,
    }: {
      productId: string;
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      };
    }
  ) => {
    const cart = get(cartAtom);
    const validation = validateRemoveCartItem(cart, productId);

    if (!validation.valid) {
      options?.onError?.(validation);
      return;
    }

    set(cartAtom, (prevCart) => removeItemFromCart(prevCart, productId));
    options?.onSuccess?.(validation);
  }
);

export const updateQuantityAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      newQuantity,
      options,
    }: {
      productId: string;
      newQuantity: number;
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      };
    }
  ) => {
    const cart = get(cartAtom);
    const validation = validateUpdateCartItemQuantity(
      cart,
      productId,
      newQuantity
    );

    if (!validation.valid) {
      options?.onError?.(validation);
      return;
    }

    if (newQuantity > 0) {
      set(cartAtom, (prevCart) =>
        updateItemQuantity(prevCart, productId, newQuantity)
      );
    } else {
      set(cartAtom, (prevCart) => removeItemFromCart(prevCart, productId));
    }

    options?.onSuccess?.(validation);
  }
);

export const applyCouponAtom = atom(
  null,
  (
    get,
    set,
    {
      coupon,
      options,
    }: {
      coupon: Coupon;
      options?: {
        onSuccess?: (validation: CartValidation) => void;
        onError?: (validation: CartValidation) => void;
      };
    }
  ) => {
    const cart = get(cartAtom);
    const validation = validateApplyCoupon(cart, coupon);

    if (!validation.valid) {
      options?.onError?.(validation);
      return;
    }

    set(selectedCouponAtom, coupon);
    options?.onSuccess?.(validation);
  }
);

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartAtom, []);
  set(selectedCouponAtom, null);
});
