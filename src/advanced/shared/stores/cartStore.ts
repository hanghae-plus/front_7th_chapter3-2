import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../../entities/cart/model/types';
import { Product } from '../../entities/product/model/types';
import { STORAGE_KEYS } from '../config/storageKeys';

interface CartStore {
  cart: CartItem[];
  getItem: (productId: string) => CartItem | undefined;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      getItem: (productId) =>
        get().cart.find((item) => item.product.id === productId),

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.product.id === product.id,
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getTotalItemCount: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: STORAGE_KEYS.CART,
    },
  ),
);
