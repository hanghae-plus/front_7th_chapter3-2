import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Coupon, Product } from '../../types';
import { ProductWithUI } from '../models/product';
import {
  calculateItemTotal as calcItemTotal,
  calculateCartTotal as calcCartTotal,
  getRemainingStock as getRemStock,
} from '../models/cart';
import { STORAGE_KEYS } from '../constants';
import { cartStorage } from './storage';

interface CartState {
  cart: CartItem[];
  selectedCoupon: Coupon | null;

  // Computed
  getTotalItemCount: () => number;
  getRemainingStock: (product: Product) => number;
  calculateItemTotal: (item: CartItem) => number;
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };

  // Actions
  addToCart: (
    product: ProductWithUI
  ) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: ProductWithUI[]
  ) => { success: boolean; message?: string };
  applyCoupon: (coupon: Coupon) => { success: boolean; message?: string };
  clearCoupon: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedCoupon: null,

      getTotalItemCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      getRemainingStock: (product) => {
        return getRemStock(product, get().cart);
      },

      calculateItemTotal: (item) => {
        return calcItemTotal(item, get().cart);
      },

      calculateCartTotal: () => {
        return calcCartTotal(get().cart, get().selectedCoupon);
      },

      addToCart: (product) => {
        const { cart } = get();
        const remainingStock = getRemStock(product, cart);

        if (remainingStock <= 0) {
          return { success: false, message: '재고가 부족합니다!' };
        }

        const existingItem = cart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          if (newQuantity > product.stock) {
            return { success: false, message: '재고가 부족합니다!' };
          }

          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }

        return { success: true, message: '장바구니에 담았습니다' };
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, newQuantity, products) => {
        if (newQuantity <= 0) {
          get().removeFromCart(productId);
          return { success: true };
        }

        const product = products.find((p) => p.id === productId);
        if (!product) return { success: false };

        const maxStock = product.stock;
        if (newQuantity > maxStock) {
          return {
            success: false,
            message: `재고는 ${maxStock}개까지만 있습니다.`,
          };
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));

        return { success: true };
      },

      applyCoupon: (coupon) => {
        const { cart } = get();
        const currentTotal = calcCartTotal(cart, null).totalAfterDiscount;

        if (currentTotal < 10000 && coupon.discountType === 'percentage') {
          return {
            success: false,
            message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          };
        }

        set({ selectedCoupon: coupon });
        return { success: true, message: '쿠폰이 적용되었습니다.' };
      },

      clearCoupon: () => {
        set({ selectedCoupon: null });
      },

      clearCart: () => {
        set({ cart: [], selectedCoupon: null });
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      storage: cartStorage,
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
