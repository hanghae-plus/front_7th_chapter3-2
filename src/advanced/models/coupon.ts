export interface ValidationResult {
  isValid: boolean;
  error?: string;
  correctedValue?: number;
}

export const validateCouponPercentage = (value: number): ValidationResult => {
  if (value < 0) {
    return {
      isValid: false,
      error: undefined,
      correctedValue: 0,
    };
  }
  if (value > 100) {
    return {
      isValid: false,
      error: "할인율은 100%를 초과할 수 없습니다",
      correctedValue: 100,
    };
  }
  return { isValid: true };
};

export const validateCouponAmount = (value: number): ValidationResult => {
  if (value < 0) {
    return {
      isValid: false,
      error: undefined,
      correctedValue: 0,
    };
  }
  if (value > 100000) {
    return {
      isValid: false,
      error: "할인 금액은 100,000원을 초과할 수 없습니다",
      correctedValue: 100000,
    };
  }
  return { isValid: true };
};

export const isValidCouponCode = (code: string): boolean => {
  return /^[A-Z0-9]{4,12}$/.test(code);
};

export const formatCouponValue = (
  discountType: "amount" | "percentage",
  discountValue: number
): string => {
  if (discountType === "amount") {
    return `${discountValue.toLocaleString()}원 할인`;
  }
  return `${discountValue}% 할인`;
};
