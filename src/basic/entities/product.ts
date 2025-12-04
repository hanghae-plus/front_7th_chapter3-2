import { CartItem, Product } from '../../types';

// GET REMAINING STOCK
export const getRemainingStock = (product: Product, cartItems: CartItem[]): number => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
