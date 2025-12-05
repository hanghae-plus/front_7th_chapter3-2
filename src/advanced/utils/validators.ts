// 쿠폰 코드 형식 검증 (4-12자)
export const isValidCouponCode = (code: string): boolean => {
  return /^[A-Z0-9]{4,12}$/.test(code);
};

// 재고 수량 검증(0 이상)
export const isValidStock = (stock: number): boolean => {
  return stock >= 0;
};

// 가격 검증 (양수)
export const isValidPrice = (price: number): boolean => {
  return price > 0;
};

// 문자열에서 숫자만 추출
export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};