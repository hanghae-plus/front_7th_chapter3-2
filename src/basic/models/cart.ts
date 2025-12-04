import { CartItem, Coupon, ProductWithUI } from "../../types";
import { getRemainingStock } from "./product";
import { getMaxApplicableDiscount, calculateDiscountedPrice } from "./discount";
import {
  applyCouponDiscount,
  calculateTotalBeforeCoupon,
} from "./coupon";

/**
 * 장바구니의 총 아이템 개수를 계산하는 순수 함수
 * @param cart 장바구니 아이템 배열
 * @returns 총 아이템 개수
 */
export const getTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * 장바구니 아이템의 총액을 계산하는 순수 함수 (할인 적용)
 * @param cart 장바구니 아이템 배열
 * @param item 계산할 장바구니 아이템
 * @returns 할인 적용 후 총액
 */
export const calculateItemTotal = (
  cart: CartItem[],
  item: CartItem
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discountRate = getMaxApplicableDiscount(cart, item);

  return calculateDiscountedPrice(price, quantity, discountRate);
};

/**
 * 장바구니의 원가 총액을 계산하는 순수 함수 (할인 미적용)
 * @param cart 장바구니 아이템 배열
 * @returns 원가 총액
 */
export const calculateCartOriginalTotal = (cart: CartItem[]): number => {
  return Math.round(
    cart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0)
  );
};

/**
 * 장바구니의 총액을 계산하는 순수 함수 (할인 + 쿠폰 적용)
 * @param cart 장바구니 아이템 배열
 * @param selectedCoupon 적용할 쿠폰
 * @returns 할인 전 총액과 할인 후 총액
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = calculateCartOriginalTotal(cart);
  const totalAfterItemDiscount = calculateTotalBeforeCoupon(cart);
  const totalAfterDiscount = applyCouponDiscount(
    totalAfterItemDiscount,
    selectedCoupon
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
  };
};

export type AddToCartError = "OUT_OF_STOCK" | "EXCEEDS_STOCK" | null;

export interface AddToCartResult {
  cart: CartItem[];
  error: AddToCartError;
}

/**
 * 장바구니에 상품을 추가하는 순수 함수
 * @param cart 현재 장바구니 아이템 배열
 * @param product 추가할 상품
 * @returns 업데이트된 장바구니와 에러 정보
 */
export const addProductToCart = (
  cart: CartItem[],
  product: ProductWithUI
): AddToCartResult => {
  const remainingStock = getRemainingStock(product, cart);

  if (remainingStock <= 0) {
    return { cart, error: "OUT_OF_STOCK" };
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      return { cart, error: "EXCEEDS_STOCK" };
    }

    const nextCart = cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );

    return { cart: nextCart, error: null };
  }

  const nextCart = [...cart, { product, quantity: 1 }];
  return { cart: nextCart, error: null };
};

/**
 * 장바구니에서 상품을 제거하는 순수 함수
 * @param cart 현재 장바구니 아이템 배열
 * @param productId 제거할 상품 ID
 * @returns 업데이트된 장바구니
 */
export const removeProductFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

/**
 * 장바구니 아이템의 수량을 업데이트하는 순수 함수
 * @param cart 현재 장바구니 아이템 배열
 * @param productId 수정할 상품 ID
 * @param newQuantity 새로운 수량
 * @returns 업데이트된 장바구니
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return removeProductFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};

