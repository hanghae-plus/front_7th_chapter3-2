// TODO: 상품 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)

import { Product } from "../../types";

const LOW_STOCK_THRESHOLD = 5;

/**
 * 상품의 최대 할인율 계산
 */
export const getMaxDiscountRate = (product: Product): number => {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map((d) => d.rate)) * 100;
};

/**
 * 재고 상태 정보 반환
 */
export const getStockStatus = (
  remainingStock: number
): {
  isLowStock: boolean;
  isOutOfStock: boolean;
  message: string;
  buttonText: string;
} => {
  if (remainingStock <= 0) {
    return {
      isLowStock: false,
      isOutOfStock: true,
      message: "",
      buttonText: "품절",
    };
  }

  if (remainingStock <= LOW_STOCK_THRESHOLD) {
    return {
      isLowStock: true,
      isOutOfStock: false,
      message: `품절임박! ${remainingStock}개 남음`,
      buttonText: "장바구니 담기",
    };
  }

  return {
    isLowStock: false,
    isOutOfStock: false,
    message: `재고 ${remainingStock}개`,
    buttonText: "장바구니 담기",
  };
};

/**
 * 할인 정보가 있는지 확인
 */
export const hasDiscount = (product: Product): boolean => {
  return product.discounts.length > 0;
};

/**
 * 첫 번째 할인 정보 반환
 */
export const getFirstDiscount = (product: Product) => {
  if (!hasDiscount(product)) return null;
  const discount = product.discounts[0];
  return {
    quantity: discount.quantity,
    rate: discount.rate * 100,
  };
};
