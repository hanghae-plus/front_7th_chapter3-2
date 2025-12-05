/**
 * 상품 관련 유효성 검증
 */

export interface ProductValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 상품 가격 유효성 검증
 */
export const validateProductPrice = (
  price: number
): ProductValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      error: '가격은 0보다 커야 합니다',
    };
  }
  return { isValid: true };
};

/**
 * 상품 재고 유효성 검증
 */
export const validateProductStock = (
  stock: number
): ProductValidationResult => {
  if (stock < 0) {
    return {
      isValid: false,
      error: '재고는 0보다 커야 합니다',
    };
  }
  if (stock > 9999) {
    return {
      isValid: false,
      error: '재고는 9999개를 초과할 수 없습니다',
    };
  }
  return { isValid: true };
};

/**
 * 할인율 유효성 검증 (0-100%)
 */
export const validateDiscountRate = (rate: number): ProductValidationResult => {
  if (rate < 0) {
    return {
      isValid: false,
      error: '할인율은 0% 이상이어야 합니다',
    };
  }
  if (rate > 100) {
    return {
      isValid: false,
      error: '할인율은 100%를 초과할 수 없습니다',
    };
  }
  return { isValid: true };
};

/**
 * 쿠폰 관련 유효성 검증
 */

/**
 * 쿠폰 할인 금액 유효성 검증
 */
export const validateCouponAmount = (
  amount: number
): ProductValidationResult => {
  if (amount < 0) {
    return {
      isValid: false,
      error: '할인 금액은 0원 이상이어야 합니다',
    };
  }
  if (amount > 100000) {
    return {
      isValid: false,
      error: '할인 금액은 100,000원을 초과할 수 없습니다',
    };
  }
  return { isValid: true };
};

/**
 * 쿠폰 할인율 유효성 검증
 */
export const validateCouponPercentage = (
  percentage: number
): ProductValidationResult => {
  if (percentage < 0) {
    return {
      isValid: false,
      error: '할인율은 0% 이상이어야 합니다',
    };
  }
  if (percentage > 100) {
    return {
      isValid: false,
      error: '할인율은 100%를 초과할 수 없습니다',
    };
  }
  return { isValid: true };
};

/**
 * 쿠폰 코드 형식 유효성 검증
 */
export const validateCouponCode = (code: string): ProductValidationResult => {
  if (code.length === 0) {
    return {
      isValid: false,
      error: '쿠폰 코드를 입력해주세요',
    };
  }
  if (!/^[A-Z0-9]+$/.test(code)) {
    return {
      isValid: false,
      error: '쿠폰 코드는 대문자와 숫자만 사용할 수 있습니다',
    };
  }
  return { isValid: true };
};

/**
 * 숫자 입력 유효성 검증
 */
export const isValidIntegerInput = (value: string): boolean => {
  return value === '' || /^\d+$/.test(value);
};

/**
 * 안전한 정수 파싱
 */
export const safeParseInt = (
  value: string,
  defaultValue: number = 0
): number => {
  if (value === '') return defaultValue;
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
