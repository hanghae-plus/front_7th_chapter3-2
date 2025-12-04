/**
 * 숫자만 입력 가능하도록 검증합니다.
 */
export const isNumericInput = (value: string): boolean => {
  return value === '' || /^\d+$/.test(value);
};

/**
 * 입력값을 숫자로 변환합니다. 빈 문자열이면 0을 반환합니다.
 */
export const parseNumericInput = (value: string): number => {
  return value === '' ? 0 : parseInt(value, 10);
};

/**
 * 문자열을 대문자로 변환합니다.
 */
export const toUpperCase = (value: string): string => {
  return value.toUpperCase();
};

/**
 * 할인율을 백분율에서 소수로 변환합니다.
 */
export const convertPercentageToDecimal = (percentage: number): number => {
  return percentage / 100;
};

/**
 * 할인율을 소수에서 백분율로 변환합니다.
 */
export const convertDecimalToPercentage = (decimal: number): number => {
  return decimal * 100;
};

