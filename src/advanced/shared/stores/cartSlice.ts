import { StateCreator } from "zustand";
import { CartItem, Coupon } from "../../lib/types";
import { ProductWithUI, STORAGE_KEYS } from "../../lib/constants";
import { getRemainingStock } from "../../domains/product/utils/productUtils";
import { NotificationSlice } from "./notificationSlice";
import { ProductSlice } from "./productSlice";

export interface CartSlice {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const createCartSlice: StateCreator<
  CartSlice & ProductSlice & NotificationSlice,
  [],
  [],
  CartSlice
> = (set, get) => ({
  cart: (() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  })(),
  selectedCoupon: null,

  addToCart: (product: ProductWithUI) => {
    const { cart, addNotification } = get();

    const remainingStock = getRemainingStock(product, cart);
    if (remainingStock <= 0) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      const newCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );

      set({ cart: newCart });
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
    } else {
      const newCart = [...cart, { product, quantity: 1 }];
      set({ cart: newCart });
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
    }

    addNotification("장바구니에 담았습니다", "success");
  },

  removeFromCart: (productId: string) => {
    set((state) => {
      const newCart = state.cart.filter(
        (item) => item.product.id !== productId
      );
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateQuantity: (productId: string, newQuantity: number) => {
    const { cart, removeFromCart, products, addNotification } = get();

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
      return;
    }

    const newCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );

    set({ cart: newCart });
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
  },

  applyCoupon: (coupon: Coupon) => {
    set({ selectedCoupon: coupon });
  },

  clearCoupon: () => {
    set({ selectedCoupon: null });
  },

  clearCart: () => {
    set({ cart: [], selectedCoupon: null });
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  calculateTotal: () => {
    const { cart } = get();
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },
});
