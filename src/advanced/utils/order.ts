/**
 * 주문번호를 생성합니다.
 */
export const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}`;
};

