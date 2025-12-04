/**
 * 폼 검증을 위한 순수 함수들
 * 검증 실패 시 에러 메시지를 반환하고, 성공 시 null을 반환합니다.
 */

/**
 * 재고 수량 검증
 */
export const validateStock = (value: number): string | null => {
  if (value < 0) return "재고는 0 이상이어야 합니다";
  if (value === 0) return "재고는 0보다 커야 합니다";
  if (value > 9999) return "재고는 9999 이하여야 합니다";
  return null; // 검증 통과
};

/**
 * 가격 검증
 */
export const validatePrice = (value: number): string | null => {
  if (value <= 0) return "가격은 0보다 커야 합니다";
  return null;
};

/**
 * 쿠폰 할인율 검증 (퍼센트 타입)
 */
export const validateDiscountRate = (value: number): string | null => {
  if (value > 100) return "할인율은 100%를 초과할 수 없습니다";
  if (value < 0) return "할인율은 0 이상이어야 합니다";
  return null;
};
