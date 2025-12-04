/**
 * 검증 유틸리티 함수들
 * 엔티티와 무관한 범용 검증 함수들
 */

/**
 * 쿠폰 코드 형식 검증
 * @param code 검증할 쿠폰 코드
 * @returns 유효한 쿠폰 코드인지 여부 (4-12자 영문 대문자와 숫자)
 */
export const isValidCouponCode = (code: string): boolean => {
  if (!code || typeof code !== "string") {
    return false;
  }
  // 4-12자 영문 대문자와 숫자만 허용
  return /^[A-Z0-9]{4,12}$/.test(code);
};

/**
 * 재고 수량 검증
 * @param stock 검증할 재고 수량
 * @returns 유효한 재고 수량인지 여부 (0 이상의 정수)
 */
export const isValidStock = (stock: number): boolean => {
  return (
    typeof stock === "number" &&
    !isNaN(stock) &&
    stock >= 0 &&
    Number.isInteger(stock)
  );
};

/**
 * 가격 검증
 * @param price 검증할 가격
 * @returns 유효한 가격인지 여부 (양수)
 */
export const isValidPrice = (price: number): boolean => {
  return (
    typeof price === "number" &&
    !isNaN(price) &&
    price > 0 &&
    Number.isFinite(price)
  );
};

/**
 * 문자열에서 숫자만 추출
 * @param value 추출할 문자열
 * @returns 숫자만 포함된 문자열
 */
export const extractNumbers = (value: string): string => {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\D/g, "");
};

/**
 * 할인율 검증
 * @param rate 검증할 할인율 (0-1 사이의 소수)
 * @returns 유효한 할인율인지 여부
 */
export const isValidDiscountRate = (rate: number): boolean => {
  return (
    typeof rate === "number" &&
    !isNaN(rate) &&
    rate >= 0 &&
    rate <= 1 &&
    Number.isFinite(rate)
  );
};

/**
 * 할인 수량 검증
 * @param quantity 검증할 할인 수량
 * @returns 유효한 할인 수량인지 여부 (1 이상의 정수)
 */
export const isValidDiscountQuantity = (quantity: number): boolean => {
  return (
    typeof quantity === "number" &&
    !isNaN(quantity) &&
    quantity >= 1 &&
    Number.isInteger(quantity)
  );
};
