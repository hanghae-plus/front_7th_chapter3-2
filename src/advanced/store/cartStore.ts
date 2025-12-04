import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Coupon, Product, ProductWithUI } from "../../types";
import {
  calculateItemTotal as calcItemTotal,
  calculateCartTotal as calcCartTotal,
  updateCartItemQuantity,
} from "../utils/cartCalculations";
import { getRemainingStock as calcRemainingStock } from "../utils/productCalculations";
import { useNotificationStore } from "./notificationStore";
import { useProductStore } from "./productStore";

type CartState = {
  cart: CartItem[];
  totalItemCount: number;
};

type CartActions = {
  calculateItemTotal: (item: CartItem) => number;
  calculateCartTotal: (selectedCoupon: Coupon | null) => ReturnType<typeof calcCartTotal>;
  getRemainingStock: (product: Product) => number;

  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  completeOrder: (onSuccess?: () => void) => void;
  reset: () => void;
};

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItemCount: 0,

      calculateItemTotal: (item) => {
        return calcItemTotal(item, get().cart);
      },

      calculateCartTotal: (selectedCoupon) => {
        return calcCartTotal(get().cart, selectedCoupon);
      },

      getRemainingStock: (product) => {
        return calcRemainingStock(product, get().cart);
      },

      addToCart: (product) => {
        const cart = get().cart;
        const remainingStock = calcRemainingStock(product, cart);
        const addNotification = useNotificationStore.getState().addNotification;

        if (remainingStock <= 0) {
          addNotification("재고가 부족합니다!", "error");
          return;
        }

        let nextCart: CartItem[];

        const existingItem = cart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
            return;
          }

          nextCart = cart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        } else {
          nextCart = [...cart, { product, quantity: 1 }];
        }

        set(() => {
          const totalItemCount = nextCart.reduce((sum, item) => sum + item.quantity, 0);
          return { cart: nextCart, totalItemCount };
        });

        addNotification("장바구니에 담았습니다", "success");
      },

      removeFromCart: (productId) => {
        set((state) => {
          const nextCart = state.cart.filter((item) => item.product.id !== productId);
          const totalItemCount = nextCart.reduce((sum, item) => sum + item.quantity, 0);

          return { cart: nextCart, totalItemCount };
        });
      },

      updateQuantity: (productId, newQuantity) => {
        const products = useProductStore.getState().products;
        const addNotification = useNotificationStore.getState().addNotification;

        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const maxStock = product.stock;
        if (newQuantity > maxStock) {
          addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
          return;
        }

        set((state) => {
          const nextCart = updateCartItemQuantity(state.cart, productId, newQuantity);
          const totalItemCount = nextCart.reduce((sum, item) => sum + item.quantity, 0);

          return { cart: nextCart, totalItemCount };
        });
      },

      completeOrder: (onSuccess) => {
        const addNotification = useNotificationStore.getState().addNotification;
        const orderNumber = `ORD-${Date.now()}`;

        addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");

        set({ cart: [], totalItemCount: 0 });

        if (onSuccess) onSuccess();
      },

      reset: () => {
        set({ cart: [], totalItemCount: 0 });
      },
    }),
    {
      name: "cart", // localStorage key
    }
  )
);
