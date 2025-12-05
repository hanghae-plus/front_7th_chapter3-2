import { CartItem } from '@/features/cart';
import { Coupon } from '@/features/coupon';

export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const {
    quantity,
    product: { discounts },
  } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 여부 확인 (장바구니에 10개 이상 구매한 상품이 있는지)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

  // 대량 구매 시 전체 상품에 추가 5% 할인 적용 (최대 50%)
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const {
    quantity,
    product: { price },
  } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon?: Coupon | null
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

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};
