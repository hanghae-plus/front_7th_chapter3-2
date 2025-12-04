import { useCallback, useMemo } from 'react';
import { addItemToCart, getRemainingStock, removeItemFromCart, updateCartItemQuantity } from '../models/cart';
import { CartItem } from '../types/carts';
import { ProductWithUI } from '../types/products';
import useLocalStorage from './local-storage';
import { AddNotification } from './notifications';

export interface UseCartReturn {
  cart: CartItem[];
  totalItemCount: number;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number, products: ProductWithUI[]) => void;
  clearCart: () => void;
}

const useCart = (addNotification: AddNotification): UseCartReturn => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);

      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map(item => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return addItemToCart(prevCart, product);
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, setCart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(prevCart => removeItemFromCart(prevCart, productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: ProductWithUI[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
    },
    [setCart, removeFromCart, addNotification]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

export default useCart;
