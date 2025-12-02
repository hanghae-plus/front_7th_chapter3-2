import { CartItem, Coupon } from '@/types';

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const {
    quantity,
    product: { discounts },
  } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  return baseDiscount;
};

export const calculateItemTotal = (item: CartItem): number => {
  const {
    quantity,
    product: { price },
  } = item;
  const discount = getMaxApplicableDiscount(item);

  return Math.round(price * quantity * (1 - discount));
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon?: Coupon
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 대량 구매 여부 확인 (장바구니에 10개 이상 구매한 상품이 있는지)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;

    // 각 상품의 기본 할인율 계산
    const baseDiscount = getMaxApplicableDiscount(item);

    // 대량 구매 시 전체 상품에 추가 5% 할인 적용 (최대 50%)
    const finalDiscount = hasBulkPurchase
      ? Math.min(baseDiscount + 0.05, 0.5)
      : baseDiscount;

    totalAfterDiscount += Math.round(itemPrice * (1 - finalDiscount));
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
