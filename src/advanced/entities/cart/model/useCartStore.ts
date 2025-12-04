import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '../../../../types';
import { ProductWithUI } from '../../../shared/config';
import * as cartModel from './cart';

interface CartState {
  // 상태
  cart: cartModel.CartItemWithUI[];
  selectedCoupon: Coupon | null;

  // 액션
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addToCart: (product: ProductWithUI) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: ProductWithUI[]
  ) => { success: boolean; message?: string };
  applyCoupon: (coupon: Coupon) => { success: boolean; message?: string };
  completeOrder: () => string;
  clearCart: () => void;

  // 파생 상태 계산
  getRemainingStock: (product: ProductWithUI) => number;
  calculateItemTotal: (item: cartModel.CartItemWithUI) => number;
  calculateCartTotal: () => cartModel.CartTotals;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      cart: [],
      selectedCoupon: null,

      // 액션
      setSelectedCoupon: (coupon) => set({ selectedCoupon: coupon }),

      addToCart: (product) => {
        const { cart } = get();
        const remainingStock = cartModel.getRemainingStock(product, cart);

        if (remainingStock <= 0) {
          return { success: false, message: '재고가 부족합니다!' };
        }

        const existingItem = cart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            return {
              success: false,
              message: `재고는 ${product.stock}개까지만 있습니다.`,
            };
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

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, newQuantity, products) => {
        if (newQuantity <= 0) {
          get().removeFromCart(productId);
          return { success: true };
        }

        const product = products.find((p) => p.id === productId);
        if (!product) return { success: false };

        if (newQuantity > product.stock) {
          return {
            success: false,
            message: `재고는 ${product.stock}개까지만 있습니다.`,
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
        const { cart, selectedCoupon } = get();
        const totals = cartModel.calculateCartTotal(cart, selectedCoupon);

        if (totals.totalAfterDiscount < 10000 && coupon.discountType === 'percentage') {
          return {
            success: false,
            message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          };
        }

        set({ selectedCoupon: coupon });
        return { success: true, message: '쿠폰이 적용되었습니다.' };
      },

      completeOrder: () => {
        const orderNumber = `ORD-${Date.now()}`;
        set({ cart: [], selectedCoupon: null });
        return orderNumber;
      },

      clearCart: () => set({ cart: [], selectedCoupon: null }),

      // 파생 상태 계산
      getRemainingStock: (product) => {
        const { cart } = get();
        return cartModel.getRemainingStock(product, cart);
      },

      calculateItemTotal: (item) => {
        const { cart } = get();
        return cartModel.calculateItemTotal(item, cart);
      },

      calculateCartTotal: () => {
        const { cart, selectedCoupon } = get();
        return cartModel.calculateCartTotal(cart, selectedCoupon);
      },
    }),
    {
      name: 'cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// 테스트용 리셋 함수
export const resetCartStore = () => {
  useCartStore.setState({
    cart: [],
    selectedCoupon: null,
  });
};
