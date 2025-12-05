import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addItemToCart, getRemainingStock, removeItemFromCart, updateCartItemQuantity } from '../models/cart';
import { cartStorage } from '../storage/cart';
import { CartItem } from '../types/carts';
import { ProductWithUI } from '../types/products';
import { useNotifications } from './notifications';

export interface CartContext {
  cart: CartItem[];
  totalItemCount: number;
}

interface CartActions {
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number, products: ProductWithUI[]) => void;
  clearCart: () => void;
}

interface CartStore {
  context: CartContext;
  actions: CartActions;
}

const initialContext: CartContext = {
  cart: [],
  totalItemCount: 0
};

export const calculateTotalItemCount = (cart: CartItem[]) => cart.reduce((sum, item) => sum + item.quantity, 0);

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      context: {
        ...initialContext
      },
      actions: {
        addToCart: product => {
          const { cart } = get().context;
          const { addNotification } = useNotifications.getState().actions;
          const remainingStock = getRemainingStock(product, cart);

          if (remainingStock <= 0) {
            addNotification('재고가 부족합니다!', 'error');
            return;
          }

          const existingItem = cart.find(item => item.product.id === product.id);

          if (existingItem && existingItem.quantity + 1 > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return;
          }

          const updatedCart = existingItem
            ? cart.map(item => (item.product.id === product.id ? { ...item, quantity: existingItem.quantity + 1 } : item))
            : addItemToCart(cart, product);

          set({
            context: {
              cart: updatedCart,
              totalItemCount: calculateTotalItemCount(updatedCart)
            }
          });

          addNotification('장바구니에 담았습니다', 'success');
        },
        removeFromCart: productId => {
          set(({ context }) => {
            const updatedCart = removeItemFromCart(context.cart, productId);

            return {
              context: {
                cart: updatedCart,
                totalItemCount: calculateTotalItemCount(updatedCart)
              }
            };
          });
        },
        updateQuantity: (productId, newQuantity, products) => {
          const { addNotification } = useNotifications.getState().actions;
          const { removeFromCart } = get().actions;

          if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
          }

          const product = products.find(p => p.id === productId);
          if (!product) return;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return;
          }

          set(({ context }) => {
            const updatedCart = updateCartItemQuantity(context.cart, productId, newQuantity);

            return {
              context: {
                cart: updatedCart,
                totalItemCount: calculateTotalItemCount(updatedCart)
              }
            };
          });
        },
        clearCart: () => set({ context: { ...initialContext } })
      }
    }),
    {
      name: 'cart',
      storage: cartStorage,
      partialize: ({ context }) => ({ context })
    }
  )
);

export const cartContext = () => useCart(({ context }) => context);
export const cartActions = () => useCart(({ actions }) => actions);
