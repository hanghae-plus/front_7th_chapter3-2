import type { CartItem, Coupon, Product } from '../../types';

/**
 * 장바구니 총액 계산 결과
 */
export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

/**
 * 장바구니에 대량 구매 상품이 있는지 확인합니다.
 *
 * @param cart - 장바구니 아이템 배열
 * @returns 10개 이상 구매한 상품이 있으면 true
 */
export const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some(item => item.quantity >= 10);
};

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다.
 * 대량 구매 보너스를 적용하려면 cart를 전달합니다.
 *
 * @param item - 장바구니 아이템
 * @param cart - 장바구니 (대량 구매 보너스 계산용, 선택사항)
 * @returns 적용 가능한 최대 할인율 (0 ~ 1)
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart?: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 보너스: 장바구니에 10개 이상 구매한 상품이 있으면 +5% (최대 50%)
  if (cart && hasBulkPurchase(cart)) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

/**
 * 장바구니 아이템의 총 금액을 계산합니다. (할인 적용)
 *
 * @param item - 장바구니 아이템
 * @param cart - 장바구니 (대량 구매 보너스 계산용, 선택사항)
 * @returns 할인이 적용된 총 금액
 */
export const calculateItemTotal = (item: CartItem, cart?: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체 금액을 계산합니다. (쿠폰 할인 포함)
 *
 * @param cart - 장바구니 아이템 배열
 * @param selectedCoupon - 선택된 쿠폰 (없으면 null)
 * @returns 할인 전 총액, 할인 후 총액, 총 할인액
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

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount) - Math.round(totalAfterDiscount)
  };
};

/**
 * 장바구니 아이템의 수량을 업데이트합니다. (불변성 유지)
 *
 * @param cart - 장바구니 아이템 배열
 * @param productId - 업데이트할 상품 ID
 * @param newQuantity - 새로운 수량 (0 이하면 해당 아이템 제거)
 * @returns 새로운 장바구니 배열
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
    item.product.id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );
};

/**
 * 상품의 남은 재고를 계산합니다.
 *
 * @param product - 상품
 * @param cart - 장바구니 아이템 배열
 * @returns 남은 재고 수량
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 장바구니에 상품을 추가합니다. (불변성 유지)
 *
 * @param cart - 장바구니 아이템 배열
 * @param product - 추가할 상품
 * @returns 새로운 장바구니 배열
 */
export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    return cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

/**
 * 장바구니에서 상품을 제거합니다. (불변성 유지)
 *
 * @param cart - 장바구니 아이템 배열
 * @param productId - 제거할 상품 ID
 * @returns 새로운 장바구니 배열
 */
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

/**
 * 장바구니 아이템에 적용된 할인율을 계산합니다.
 *
 * @param item - 장바구니 아이템
 * @param cart - 장바구니 (대량 구매 보너스 계산용, 선택사항)
 * @returns 적용된 할인율 (퍼센트, 0 ~ 100)
 */
export const getAppliedDiscountRate = (item: CartItem, cart?: CartItem[]): number => {
  const originalPrice = item.product.price * item.quantity;
  const discountedPrice = calculateItemTotal(item, cart);

  if (originalPrice === 0) return 0;

  return Math.round((1 - discountedPrice / originalPrice) * 100);
};
