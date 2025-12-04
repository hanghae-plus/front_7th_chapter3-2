/**
 * 숫자 범위 검증 결과 타입
 */
export interface ValidationResult {
  isValid: boolean;
  validatedValue: number;
  errorMessage?: string;
}

/**
 * 숫자 값의 범위를 검증합니다.
 * @param value 검증할 값
 * @param options 검증 옵션
 * @param options.min 최소값
 * @param options.max 최대값
 * @param options.errorMessages 에러 메시지 { min?: string, max?: string }
 * @returns 검증 결과 { isValid: boolean, validatedValue: number, errorMessage?: string }
 */
export const validateRange = (
  value: number,
  options: {
    min?: number;
    max?: number;
    errorMessages?: {
      min?: string;
      max?: string;
    };
  } = {}
): ValidationResult => {
  const { min, max, errorMessages } = options;

  // 최소값 검증
  if (min !== undefined && value < min) {
    return {
      isValid: false,
      validatedValue: min,
      errorMessage: errorMessages?.min
    };
  }

  // 최대값 검증
  if (max !== undefined && value > max) {
    return {
      isValid: false,
      validatedValue: max,
      errorMessage: errorMessages?.max
    };
  }

  return {
    isValid: true,
    validatedValue: value
  };
};

