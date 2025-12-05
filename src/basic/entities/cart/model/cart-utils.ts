import { CartItem, Coupon, Product } from '../../../../types';
import { ProductWithUI } from '../../product';

// ============= 상수 정의 =============

const BULK_PURCHASE_THRESHOLD = 10; // 대량 구매 할인 임계값
const BULK_DISCOUNT_RATE = 0.05; // 대량 구매 시 추가 할인율
const MAX_DISCOUNT_RATE = 0.5; // 최대 할인율 (50%)
const MIN_PERCENTAGE_COUPON_AMOUNT = 10000; // 퍼센트 쿠폰 최소 적용 금액

// ============= Level 1: 원자적 계산 함수 =============

// 할인을 적용한 가격 계산
const applyDiscount = (price: number, discountRate: number): number => {
  return Math.round(price * (1 - discountRate));
};

// 상품에 적용 가능한 기본 할인율 계산 (수량 할인만)
const getBaseDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

// ============= Level 2: 단순 조회 및 변환 =============

// 대량 구매 할인 적용 가능 여부 확인 (10개 이상)
export const hasBulkDiscount = (cart: CartItem[]): boolean => {
  return cart.some((item) => item.quantity >= BULK_PURCHASE_THRESHOLD);
};

// 특정 상품의 남은 재고 계산
export const getRemainingStock = (
  cart: CartItem[],
  product: Product
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

// 장바구니 아이템 수량 변경 (0 이하면 제거) - cart-reducer에서 사용
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

// 상품을 장바구니에 추가 - cart-reducer에서 사용
export const addItemToCart = (
  cart: CartItem[],
  product: ProductWithUI
): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (!existingItem) {
    return [...cart, { product, quantity: 1 }];
  }

  const newQuantity = existingItem.quantity + 1;

  return cart.map((item) =>
    item.product.id === product.id ? { ...item, quantity: newQuantity } : item
  );
};

// 장바구니에서 상품 제거 - cart-reducer에서 사용
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

// 특정 상품의 최대 적용 가능 할인율 계산 (기본 할인 + 대량 구매 할인)
const getMaxApplicableDiscount = (
  item: CartItem,
  isBulkPurchase: boolean
): number => {
  const baseDiscount = getBaseDiscount(item);

  if (isBulkPurchase) {
    return Math.min(baseDiscount + BULK_DISCOUNT_RATE, MAX_DISCOUNT_RATE);
  }

  return baseDiscount;
};

// 개별 상품의 할인 적용 후 총액 계산
export const calculateItemTotal = (
  item: CartItem,
  isBulkPurchase: boolean
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, isBulkPurchase);

  return applyDiscount(price * quantity, discount);
};

// ============= Level 3: 집계 및 복합 계산 =============

// 장바구니 총액 계산 (상품 할인 + 쿠폰 적용)
export const calculateTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const isBulkPurchase = hasBulkDiscount(cart);
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, isBulkPurchase);
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

// 쿠폰 적용 가능 여부 확인
export const canApplyCoupon = (
  cart: CartItem[],
  coupon: Coupon,
  currentCoupon: Coupon | null
): boolean => {
  const currentTotal = calculateTotal(cart, currentCoupon).totalAfterDiscount;

  if (
    coupon.discountType === 'percentage' &&
    currentTotal < MIN_PERCENTAGE_COUPON_AMOUNT
  ) {
    return false;
  }

  return true;
};
