import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CartItem, Product, Coupon } from '../../types';
import {
  calculateCartTotal,
  calculateItemTotal,
  getRemainingStock,
  getTotalItemCount,
  updateCartItemQuantity,
} from '../utils/cartUtils';

const loadFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

interface CartStore {
  cart: CartItem[];

  // 파생 데이터 계산
  getTotalItemCount: () => number;
  getCartTotal: (selectedCoupon: Coupon | null) => ReturnType<typeof calculateCartTotal>;
  getItemTotal: (item: CartItem) => number;
  getRemainingStock: (product: Product) => number;

  // 액션
  addToCart: (product: Product) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    maxStock: number
  ) => { success: boolean; message?: string };
  clearCart: () => void;
  _reset: () => void;
}

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    cart: loadFromStorage(),

    getTotalItemCount: () => getTotalItemCount(get().cart),

    getCartTotal: (selectedCoupon) =>
      calculateCartTotal(get().cart, selectedCoupon),

    getItemTotal: (item) => calculateItemTotal(item, get().cart),

    getRemainingStock: (product) => getRemainingStock(product, get().cart),

    addToCart: (product) => {
      const { cart } = get();
      const remaining = getRemainingStock(product, cart);

      if (remaining <= 0) {
        return { success: false, message: '재고가 부족합니다!' };
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem && existingItem.quantity >= product.stock) {
        return {
          success: false,
          message: `재고는 ${product.stock}개까지만 있습니다.`,
        };
      }

      set((state) => {
        const existing = state.cart.find(
          (item) => item.product.id === product.id
        );
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { product, quantity: 1 }] };
      });

      return { success: true, message: '장바구니에 담았습니다' };
    },

    removeFromCart: (productId) =>
      set((state) => ({
        cart: state.cart.filter((item) => item.product.id !== productId),
      })),

    updateQuantity: (productId, newQuantity, maxStock) => {
      if (newQuantity <= 0) {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
        return { success: true };
      }

      if (newQuantity > maxStock) {
        return {
          success: false,
          message: `재고는 ${maxStock}개까지만 있습니다.`,
        };
      }

      set((state) => ({
        cart: updateCartItemQuantity(state.cart, productId, newQuantity),
      }));
      return { success: true };
    },

    clearCart: () => set({ cart: [] }),

    _reset: () => set({ cart: [] }),
  }))
);

// localStorage 동기화
useCartStore.subscribe(
  (state) => state.cart,
  (cart) => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }
);
