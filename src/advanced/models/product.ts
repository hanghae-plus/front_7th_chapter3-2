import { Product } from "../../types";
import { ProductWithUI, STOCK_THRESHOLDS } from "../constants";

// ============= 타입 정의 =============

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  correctedValue?: number;
}

// ============= 상품 검증 =============

/**
 * 상품 가격 검증
 */
export const validateProductPrice = (price: number): ValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      error: "가격은 0보다 커야 합니다",
      correctedValue: 0,
    };
  }
  return { isValid: true };
};

/**
 * 상품 재고 검증
 */
export const validateProductStock = (stock: number): ValidationResult => {
  if (stock < 0) {
    return {
      isValid: false,
      error: "재고는 0보다 커야 합니다",
      correctedValue: 0,
    };
  }
  if (stock > 9999) {
    return {
      isValid: false,
      error: "재고는 9999개를 초과할 수 없습니다",
      correctedValue: 9999,
    };
  }
  return { isValid: true };
};

/**
 * 가격 유효성 검사
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0;
};

/**
 * 재고 유효성 검사
 */
export const isValidStock = (stock: number): boolean => {
  return stock >= 0;
};

// ============= 할인율 계산 =============

export const getMaxDiscountRate = (product: Product): number => {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map((d) => d.rate));
};

export const getMaxDiscountPercentage = (product: Product): number => {
  return getMaxDiscountRate(product) * 100;
};

export const filterProductsBySearch = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm) return products;

  const lowerSearch = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearch) ||
      (product.description?.toLowerCase().includes(lowerSearch) ?? false)
  );
};

export const getStockStatusMessage = (
  remainingStock: number
): { message: string; className: string } | null => {
  if (remainingStock <= 0) {
    return null; // 품절인 경우
  }
  if (remainingStock <= STOCK_THRESHOLDS.LOW_STOCK) {
    return {
      message: `품절임박! ${remainingStock}개 남음`,
      className: "text-xs text-red-600 font-medium",
    };
  }
  return {
    message: `재고 ${remainingStock}개`,
    className: "text-xs text-gray-500",
  };
};

/**
 * 재고 배지 클래스를 반환
 */
export const getStockBadgeClass = (stock: number): string => {
  if (stock > STOCK_THRESHOLDS.GOOD_STOCK) {
    return "bg-green-100 text-green-800";
  }
  if (stock > 0) {
    return "bg-yellow-100 text-yellow-800";
  }
  return "bg-red-100 text-red-800";
};

export const getAddToCartButtonState = (remainingStock: number) => {
  const isDisabled = remainingStock <= 0;
  return {
    disabled: isDisabled,
    className: isDisabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-gray-900 text-white hover:bg-gray-800",
    label: isDisabled ? "품절" : "장바구니 담기",
  };
};
