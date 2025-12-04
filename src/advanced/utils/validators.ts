/**
 * 쿠폰 할인 값 검증 결과
 */
type CouponValidationResult = {
  isValid: boolean;
  errorMessage?: string;
  correctedValue?: number;
};

/**
 * 쿠폰 할인 값을 검증합니다
 * @param discountType 할인 타입 (amount | percentage)
 * @param value 할인 값
 * @returns 검증 결과
 */
export const validateCouponDiscount = (
  discountType: "amount" | "percentage",
  value: number
): CouponValidationResult => {
  if (discountType === "percentage") {
    if (value > 100) {
      return {
        isValid: false,
        errorMessage: "할인율은 100%를 초과할 수 없습니다",
        correctedValue: 100,
      };
    }
    if (value < 0) {
      return {
        isValid: false,
        correctedValue: 0,
      };
    }
  } else {
    // amount
    if (value > 100000) {
      return {
        isValid: false,
        errorMessage: "할인 금액은 100,000원을 초과할 수 없습니다",
        correctedValue: 100000,
      };
    }
    if (value < 0) {
      return {
        isValid: false,
        correctedValue: 0,
      };
    }
  }

  return { isValid: true };
};

/**
 * 상품 가격 검증 결과
 */
type PriceValidationResult = {
  isValid: boolean;
  errorMessage?: string;
  correctedValue?: number;
};

/**
 * 상품 가격을 검증합니다
 * @param price 가격
 * @returns 검증 결과
 */
export const validateProductPrice = (price: number): PriceValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      errorMessage: "가격은 0보다 커야 합니다",
      correctedValue: 0,
    };
  }

  return { isValid: true };
};

/**
 * 상품 재고 검증 결과
 */
type StockValidationResult = {
  isValid: boolean;
  errorMessage?: string;
  correctedValue?: number;
};

/**
 * 상품 재고를 검증합니다
 * @param stock 재고 수량
 * @returns 검증 결과
 */
export const validateProductStock = (stock: number): StockValidationResult => {
  if (stock < 0) {
    return {
      isValid: false,
      errorMessage: "재고는 0보다 커야 합니다",
      correctedValue: 0,
    };
  }

  if (stock > 9999) {
    return {
      isValid: false,
      errorMessage: "재고는 9999개를 초과할 수 없습니다",
      correctedValue: 9999,
    };
  }

  return { isValid: true };
};

/**
 * 숫자 전용 입력 검증 (정규식)
 * @param value 입력 값
 * @returns 숫자만 포함되어 있는지 여부
 */
export const isNumericInput = (value: string): boolean => {
  return value === "" || /^\d+$/.test(value);
};
