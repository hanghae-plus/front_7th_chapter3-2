// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { CartItem, Coupon, Product } from '../../types';
import { ProductWithUI } from '../constants';

// ProductWithUI를 사용하는 장바구니 아이템 타입
export interface CartItemWithUI {
  product: ProductWithUI;
  quantity: number;
}

// 장바구니 총액 타입
export interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

// 1. calculateItemTotal - 개별 아이템의 할인 적용 후 총액 계산
export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
}

// 2. getMaxApplicableDiscount - 적용 가능한 최대 할인율 계산
export function getMaxApplicableDiscount(
  item: CartItem,
  cart: CartItem[]
): number {
  const { discounts } = item.product;
  const { quantity } = item;

  // 수량에 따른 기본 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 보너스 체크 (장바구니 내 10개 이상 상품이 있으면)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 최대 50%
  }

  return baseDiscount;
}

// 3. calculateCartTotal - 장바구니 총액 계산 (할인 전/후)
export function calculateCartTotal(
  cart: CartItem[],
  coupon: Coupon | null
): CartTotals {
  // reduce로 합계 계산
  const totals = cart.reduce(
    (acc, item) => ({
      before: acc.before + item.product.price * item.quantity,
      after: acc.after + calculateItemTotal(item, cart),
    }),
    { before: 0, after: 0 }
  );

  // 쿠폰 적용
  const applyCoupon = (amount: number): number => {
    if (!coupon) return amount;
    if (coupon.discountType === 'amount') {
      return Math.max(0, amount - coupon.discountValue);
    }
    return Math.round(amount * (1 - coupon.discountValue / 100));
  };

  return {
    totalBeforeDiscount: Math.round(totals.before),
    totalAfterDiscount: applyCoupon(totals.after),
  };
}

// 4. updateCartItemQuantity - 수량 변경 (새 배열 반환)
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] {
  // 수량이 0 이하면 제거
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) => {
    if (item.product.id !== productId) return item;

    // 재고보다 많으면 재고 수량으로 제한
    const newQuantity = Math.min(quantity, item.product.stock);
    return { ...item, quantity: newQuantity };
  });
}

// 5. addItemToCart - 장바구니에 상품 추가 (새 배열 반환)
export function addItemToCart(cart: CartItem[], product: Product): CartItem[] {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    // 이미 있으면 수량 +1
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  // 없으면 새로 추가
  return [...cart, { product, quantity: 1 }];
}

// 6. removeItemFromCart - 장바구니에서 상품 제거 (새 배열 반환)
export function removeItemFromCart(
  cart: CartItem[],
  productId: string
): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

// 7. getRemainingStock - 남은 재고 계산
export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
}
