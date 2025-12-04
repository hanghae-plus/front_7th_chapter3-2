import { CartItem, Coupon, Product } from '../../types';

export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다.
 * 대량 구매(10개 이상) 시 추가 5% 할인이 적용됩니다.
 */
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 시 추가 5% 할인 (최대 50%)
  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

/**
 * 단일 장바구니 아이템의 총 금액을 계산합니다 (할인 적용).
 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 쿠폰 할인을 적용합니다.
 */
export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  }
  return Math.round(total * (1 - coupon.discountValue / 100));
};

/**
 * 장바구니 전체 금액을 계산합니다 (쿠폰 적용 포함).
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotal => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount(totalAfterDiscount, selectedCoupon);
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템 수량을 업데이트합니다 (불변성 유지).
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }

  return cart.map(item =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};

/**
 * 장바구니에 아이템을 추가합니다 (불변성 유지).
 */
export const addItemToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + quantity);
  }

  return [...cart, { product, quantity }];
};

/**
 * 장바구니에서 아이템을 제거합니다.
 */
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

/**
 * 상품의 남은 재고를 계산합니다.
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity ?? 0);
};

/**
 * 장바구니 총 아이템 개수를 계산합니다.
 */
export const getTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};
