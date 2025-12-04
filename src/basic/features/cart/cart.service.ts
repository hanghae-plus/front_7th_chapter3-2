import { CartItem, Coupon } from '../../../types';

export const checkCouponAvailability = (
  coupon: Coupon,
  currentCartTotal: number,
) => {
  if (currentCartTotal < 10000 && coupon.discountType === 'percentage') {
    return false;
  }
  return true;
};

const checkHasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some((cartItem) => cartItem.quantity >= 10);
};

// 장바구니 자체 discount 적용
const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = checkHasBulkPurchase(cart);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[],
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

export const calculateCartTotalPrice = (
  cart: CartItem[],
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
  return { totalBeforeDiscount, totalAfterDiscount };
};

