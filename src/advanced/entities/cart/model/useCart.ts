import { useCartStore } from '../../../shared/stores';
import { CartItem } from './types';

interface UseCartReturn {
  cart: CartItem[];
  getItem: (productId: string) => CartItem | undefined;
  addToCart: (product: CartItem['product']) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemCount: number;
}

/**
 * 장바구니 도메인 훅
 * Zustand Store를 래핑하여 도메인 인터페이스 제공
 */
export const useCart = (): UseCartReturn => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // 파생 상태
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getItem = (productId: string): CartItem | undefined =>
    cart.find((item) => item.product.id === productId);

  return {
    cart,
    getItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemCount,
  };
};
