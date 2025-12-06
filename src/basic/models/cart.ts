import { CartItem, Coupon, Product } from "../../types";

const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;

    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (coupon) {
    if (coupon.discountType === "amount") {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - coupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - coupon.discountValue / 100));
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

const updateItemQuantity = (cart: CartItem[], productId: string, quantity: number): CartItem[] => {
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
};

const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  return [...cart, { product, quantity: 1 }];
};

const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

const getRemainingStock = (cart: CartItem[], product: Product): number => {
  return product.stock - cart.reduce((sum, item) => sum + item.quantity, 0);
};

const getCartCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

export default {
  calculateItemTotal,
  calculateCartTotal,
  getMaxApplicableDiscount,
  updateItemQuantity,
  addItemToCart,
  removeItemFromCart,
  getRemainingStock,
  getCartCount,
};
