import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { cartAtom, productsAtom } from '../store/atoms';
import { Product } from '../../types';
import { getRemainingStock } from '../utils/productUtils';
import { updateCartItemQuantity } from '../utils/cartCalculator';

export const useCartActions = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const products = useAtomValue(productsAtom);

  const addToCart = useCallback(
    (product: Product): { success: boolean; message?: string } => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        return { success: false, message: '재고가 부족합니다!' };
      }

      const existingItem = cart.find(item => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stock) {
          return { success: false, message: `재고는 ${product.stock}개까지만 있습니다.` };
        }

        setCart(prevCart =>
          prevCart.map(item =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        setCart(prevCart => [...prevCart, { product, quantity: 1 }]);
      }

      return { success: true, message: '장바구니에 담았습니다' };
    },
    [cart, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number): { success: boolean; message?: string } => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return { success: true };
      }

      const product = products.find(p => p.id === productId);
      if (!product) {
        return { success: false };
      }

      if (newQuantity > product.stock) {
        return { success: false, message: `재고는 ${product.stock}개까지만 있습니다.` };
      }

      setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
      return { success: true };
    },
    [products, removeFromCart, setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
