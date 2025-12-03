// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// TODO: 구현

export const isNumericInput = (value: string): boolean => {
  if (value === "") return true;
  return /^\d+$/.test(value);
};

export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};
