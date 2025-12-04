import { Coupon } from "./coupon";
import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export const calculateItemTotal = (item: CartItem, hasBulkPurchase: boolean = false): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, hasBulkPurchase);

  return Math.round(price * quantity * (1 - discount));
};

export const getMaxApplicableDiscount = (item: CartItem, hasBulkPurchase: boolean) => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }
  return baseDiscount;
};
export const calculateCartTotal = (cart: CartItem[], coupon: null | Coupon) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item);
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

export const updateCartItemQuantity = (cart: CartItem[], productId: string, quantity: number) => {
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
};

export const addItemToCart = (cart: CartItem[], product: Product) => {
  return [...cart, { product, quantity: 1 }];
};

export const removeItemFromCart = (cart: CartItem[], productId: string) => {
  return cart.filter((item) => item.product.id !== productId);
};

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
