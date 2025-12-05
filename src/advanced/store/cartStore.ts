import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Coupon } from '../../types';
import * as cartModel from '../models/cart';
import { getRemainingStock } from '../models/product';

interface CartState {
  cart: CartItem[];
  selectedCoupon: Coupon | null;

  // 메서드
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (products: Product[], productId: string, newQuantity: number) => boolean;
  applyCoupon: (coupon: Coupon) => boolean;
  calculateTotal: () => ReturnType<typeof cartModel.calculateCartTotal>;
  clearCart: () => void;
  completeOrder: () => string;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedCoupon: null,

  setSelectedCoupon: (coupon) => set({ selectedCoupon: coupon }),

  addToCart: (product) => {
    const { cart } = get();
    const remainingStock = getRemainingStock(product, cart);

    if (remainingStock <= 0) {
      return false; // 재고 부족
    }

    const newCart = cartModel.addItemToCart(cart, product);
    set({ cart: newCart });
    return true;
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    const newCart = cartModel.removeItemFromCart(cart, productId);
    set({ cart: newCart });
  },

  updateQuantity: (products, productId, newQuantity) => {
    const { cart, removeFromCart } = get();

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return false;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      return false; // 재고 초과
    }

    const newCart = cartModel.updateCartItemQuantity(cart, productId, newQuantity);
    set({ cart: newCart });
    return true;
  },

  applyCoupon: (coupon) => {
    const { calculateTotal } = get();
    const currentTotal = calculateTotal().totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      return false;
    }

    set({ selectedCoupon: coupon });
    return true;
  },

  calculateTotal: () => {
    const { cart, selectedCoupon } = get();
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  },

  clearCart: () => {
    set({ cart: [], selectedCoupon: null });
  },

  completeOrder: () => {
    const orderNumber = `ORD-${Date.now()}`;
    set({ cart: [], selectedCoupon: null });
    return orderNumber;
  },
    }),
    {
      name: 'cart',
      // cart 배열만 localStorage에 저장 (Basic 버전과 동일하게)
      partialize: (state) => ({ cart: state.cart }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          // 배열 형식으로 저장/로드
          const data = JSON.parse(str);
          return Array.isArray(data) ? data : data.cart || [];
        },
        setItem: (name, value) => {
          // cart 배열만 저장
          localStorage.setItem(name, JSON.stringify(value.state.cart));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)