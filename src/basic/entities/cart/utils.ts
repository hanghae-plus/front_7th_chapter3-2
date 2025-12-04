import { CartItem, Product } from '../../../types';

const BULK_PURCHASE_DISCOUNT = 0.05;
const BULK_PURCHASE_QUANTITY = 10;
const MAX_DISCOUNT = 0.5;

// ADD TO CART
export const getAddToCart = (cart: CartItem[], product: Product) => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      return cart;
    }
    return cart.map(item =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
  }
  return [...cart, { product, quantity: 1 }];
};

export const canAddToCart = (cart: CartItem[], product: Product) => {
  const existingItem = cart.find(item => item.product.id === product.id);
  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    return newQuantity <= product.stock;
  }
  return true;
};

// UPDATE CART QUANTITY
export const getUpdateCartQuantity = (cart: CartItem[], productId: string, newQuantity: number) => {
  return cart.map(item =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};

// CALCULATION
export const getApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  return baseDiscount;
};

export const getBulkPurchaseDiscount = (cartItems: CartItem[]): number => {
  return cartItems.some(cartItem => cartItem.quantity >= BULK_PURCHASE_QUANTITY)
    ? BULK_PURCHASE_DISCOUNT
    : 0;
};

export const calculateItemTotal = (item: CartItem, cartItems: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const baseDiscount = getApplicableDiscount(item);
  const bulkPurchaseDiscount = getBulkPurchaseDiscount(cartItems);
  const discount = Math.min(baseDiscount + bulkPurchaseDiscount, MAX_DISCOUNT);

  return Math.round(price * quantity * (1 - discount));
};
