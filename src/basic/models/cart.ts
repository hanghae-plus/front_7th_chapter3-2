import type { CartItem, Coupon, Product } from '../../types';

const getProductQuantityDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

const hasBulkDiscount = (cart: CartItem[]): boolean => {
  return cart.some((cartItem) => cartItem.quantity >= 10);
};

const applyBulkDiscount = (baseDiscount: number): number => {
  return Math.min(baseDiscount + 0.05, 0.5); // 추가 5% 할인, 최대 50%
};

const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const baseDiscount = getProductQuantityDiscount(item);

  if (hasBulkDiscount(cart)) {
    return applyBulkDiscount(baseDiscount);
  }

  return baseDiscount;
};

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

export const calculateCartTotal = (cart: CartItem[], coupon?: Coupon) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (coupon) {
    if (coupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - coupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - coupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    discountAmount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
};

export const removeItemFromCart = (cart: CartItem[], productId: string) => {
  return cart.filter((item) => item.product.id !== productId);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
) => {
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

export const addItemToCart = (cart: CartItem[], product: Product) => {
  return [...cart, { product, quantity: 1 }];
};

export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
