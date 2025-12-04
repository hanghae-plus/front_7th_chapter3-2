// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

const isValidCouponCode = (code: string): boolean => {
  const couponCodeRegex = /^[A-Z0-9]{4,12}$/;
  return couponCodeRegex.test(code);
};

export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && price >= 0;
};

export const isValidStock = (stock: number): boolean => {
  return !isNaN(stock) && stock >= 0 && stock <= 9999;
};

const formatCouponCode = (code: string): string => {
  return code.toUpperCase();
};

const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};

const parseDiscountValue = (value: string | number): number => {
  if (typeof value === "number") return value;
  const numeric = extractNumbers(value);
  return numeric === "" ? 0 : parseInt(numeric);
};

export { isValidCouponCode, formatCouponCode, extractNumbers, parseDiscountValue };
