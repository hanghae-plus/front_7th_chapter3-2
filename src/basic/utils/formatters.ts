import { CartItem, ProductWithUI } from "../../types";
import { getRemainingStock } from "../models/product";

/**
 * 가격을 한국 원화 형식으로 포맷하는 순수 함수
 * @param price 포맷할 가격
 * @param locale 로케일 (기본값: "ko-KR")
 * @returns 포맷된 가격 문자열 (예: "1,000")
 */
export const formatPrice = (
  price: number,
  locale: string = "ko-KR"
): string => {
  if (typeof price !== "number" || isNaN(price) || !isFinite(price)) {
    return "0";
  }
  return Math.round(price).toLocaleString(locale);
};

/**
 * 가격을 한국 원화 형식으로 포맷하고 "원" 단위를 추가하는 순수 함수
 * @param price 포맷할 가격
 * @param locale 로케일 (기본값: "ko-KR")
 * @returns 포맷된 가격 문자열 (예: "1,000원")
 */
export const formatPriceWithUnit = (
  price: number,
  locale: string = "ko-KR"
): string => {
  return `${formatPrice(price, locale)}원`;
};

/**
 * 상품 가격을 포맷하는 순수 함수 (품절 여부 포함)
 * @param price 포맷할 가격
 * @param cart 장바구니 아이템 배열
 * @param products 상품 배열
 * @param productId 상품 ID (옵션)
 * @returns 포맷된 가격 문자열 또는 "SOLD OUT"
 */
export const formatPriceText = (
  price: number,
  cart: CartItem[],
  products: ProductWithUI[],
  productId?: string
): string => {
  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product, cart) <= 0) {
      return "SOLD OUT";
    }
  }
  return formatPriceWithUnit(price);
};

/**
 * 할인율을 퍼센트 형식으로 포맷하는 순수 함수
 * @param rate 할인율 (0-1 사이의 소수)
 * @returns 포맷된 할인율 문자열 (예: "10%")
 */
export const formatDiscountRate = (rate: number): string => {
  if (typeof rate !== "number" || isNaN(rate) || rate < 0 || rate > 1) {
    return "0%";
  }
  return `${Math.round(rate * 100)}%`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷하는 순수 함수
 * @param date 포맷할 날짜
 * @returns 포맷된 날짜 문자열 (예: "2024-01-01")
 */
export const formatDate = (date: Date | string | number): string => {
  try {
    const dateObj = typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
    
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};
