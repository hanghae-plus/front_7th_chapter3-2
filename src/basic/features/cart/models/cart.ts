import { CartItem, Product } from '@/types';

export const findItemFromCartById = (cart: CartItem[], productId: string) => {
  return cart.find((item) => item.product.id === productId);
};

export const getRemainingStock = (
  cart?: CartItem[],
  product?: Product
): number => {
  if (!cart || !product) return 0;
  const cartItem = findItemFromCartById(cart, product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  return [...cart, { product, quantity: 1 }];
};

export const updateItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};
