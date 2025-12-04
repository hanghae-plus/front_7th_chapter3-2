/**
 * Shared Utils - Validators
 * 
 * 비즈니스 규칙에 따른 유효성 검증 순수 함수
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 가격 유효성 검증
 */
export const validatePrice = (price: number): ValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      errorMessage: '가격은 0보다 커야 합니다'
    };
  }
  
  if (price > 10000000) {
    return {
      isValid: false,
      errorMessage: '가격은 10,000,000원을 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 재고 유효성 검증
 */
export const validateStock = (stock: number): ValidationResult => {
  if (stock < 0) {
    return {
      isValid: false,
      errorMessage: '재고는 0보다 커야 합니다'
    };
  }
  
  if (stock > 9999) {
    return {
      isValid: false,
      errorMessage: '재고는 9999개를 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 할인율 유효성 검증 (백분율)
 */
export const validateDiscountRate = (rate: number): ValidationResult => {
  if (rate < 0) {
    return {
      isValid: false,
      errorMessage: '할인율은 0% 이상이어야 합니다'
    };
  }
  
  if (rate > 100) {
    return {
      isValid: false,
      errorMessage: '할인율은 100%를 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 할인 금액 유효성 검증
 */
export const validateDiscountAmount = (amount: number): ValidationResult => {
  if (amount < 0) {
    return {
      isValid: false,
      errorMessage: '할인 금액은 0원 이상이어야 합니다'
    };
  }
  
  if (amount > 100000) {
    return {
      isValid: false,
      errorMessage: '할인 금액은 100,000원을 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 할인 수량 유효성 검증
 */
export const validateDiscountQuantity = (quantity: number): ValidationResult => {
  if (quantity < 1) {
    return {
      isValid: false,
      errorMessage: '할인 수량은 1개 이상이어야 합니다'
    };
  }
  
  if (quantity > 9999) {
    return {
      isValid: false,
      errorMessage: '할인 수량은 9999개를 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 상품명 유효성 검증
 */
export const validateProductName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: '상품명을 입력해주세요'
    };
  }
  
  if (name.length > 100) {
    return {
      isValid: false,
      errorMessage: '상품명은 100자를 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 쿠폰명 유효성 검증
 */
export const validateCouponName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: '쿠폰명을 입력해주세요'
    };
  }
  
  if (name.length > 50) {
    return {
      isValid: false,
      errorMessage: '쿠폰명은 50자를 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 쿠폰 코드 유효성 검증
 */
export const validateCouponCode = (code: string): ValidationResult => {
  if (!code || code.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: '쿠폰 코드를 입력해주세요'
    };
  }
  
  // 영문, 숫자만 허용
  if (!/^[A-Z0-9]+$/.test(code)) {
    return {
      isValid: false,
      errorMessage: '쿠폰 코드는 영문 대문자와 숫자만 사용 가능합니다'
    };
  }
  
  if (code.length < 4) {
    return {
      isValid: false,
      errorMessage: '쿠폰 코드는 최소 4자 이상이어야 합니다'
    };
  }
  
  if (code.length > 20) {
    return {
      isValid: false,
      errorMessage: '쿠폰 코드는 20자를 초과할 수 없습니다'
    };
  }
  
  return { isValid: true };
};

/**
 * 숫자만 포함되어 있는지 검증
 */
export const isNumericString = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * 빈 문자열을 0으로 변환하거나 숫자로 파싱
 */
export const parseNumberInput = (value: string, defaultValue: number = 0): number => {
  if (value === '') return defaultValue;
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
