import { CartItem } from '../types/carts';
import { Coupon } from '../types/coupons';
import { Product } from '../types/products';

/**
 * 상품의 남은 재고를 계산합니다. (장바구니에 담긴 수량 제외)
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다.
 * - 상품별 할인율 (수량에 따른)
 * - 대량 구매 할인 (10개 이상 구매 시 5% 추가 할인)
 * - 최대 할인율은 50%로 제한
 */
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

/**
 * 장바구니 아이템의 총 금액을 계산합니다. (할인 적용 후)
 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체의 총액을 계산합니다.
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const { totalBeforeDiscount, totalAfterDiscount: beforeCoupon } = cart.reduce(
    (acc, item) => {
      const itemPrice = item.product.price * item.quantity;
      return {
        totalBeforeDiscount: acc.totalBeforeDiscount + itemPrice,
        totalAfterDiscount: acc.totalAfterDiscount + calculateItemTotal(item, cart)
      };
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );

  const totalAfterDiscount = selectedCoupon
    ? selectedCoupon.discountType === 'amount'
      ? Math.max(0, beforeCoupon - selectedCoupon.discountValue)
      : Math.round(beforeCoupon * (1 - selectedCoupon.discountValue / 100))
    : beforeCoupon;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount
  };
};

/**
 * 장바구니 아이템의 수량을 업데이트합니다.
 */
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }

  return cart.map(item => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
};

/**
 * 장바구니에 상품을 추가합니다.
 */
export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    return cart.map(item => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  return [...cart, { product, quantity: 1 }];
};

/**
 * 장바구니에서 상품을 제거합니다.
 */
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

/**
 * 장바구니 아이템의 할인율을 계산합니다.
 */
export const calculateDiscountRate = (item: CartItem, cart: CartItem[]): number => {
  const originalPrice = item.product.price * item.quantity;
  const itemTotal = calculateItemTotal(item, cart);
  const hasDiscount = itemTotal < originalPrice;
  return hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;
};

/**
 * 할인 금액을 계산합니다.
 */
export const calculateDiscountAmount = (totalBeforeDiscount: number, totalAfterDiscount: number): number => {
  return totalBeforeDiscount - totalAfterDiscount;
};

/**
 * 할인이 있는지 확인합니다.
 */
export const hasDiscount = (totalBeforeDiscount: number, totalAfterDiscount: number): boolean => {
  return calculateDiscountAmount(totalBeforeDiscount, totalAfterDiscount) > 0;
};
