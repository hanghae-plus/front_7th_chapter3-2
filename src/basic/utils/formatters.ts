// TODO: 포맷팅 유틸리티 함수들

/**가격을 한국 원화 형식으로 포맷*/
export const formatPrice = (
  price: number | string,
  unit: "₩" | "원" = "원",
  locale: "ko-KR" | "en-US" = "ko-KR"
): string => {
  let formattedPrice = price;

  if (typeof price === "string") {
    formattedPrice = Number(price);
  }

  return unit === "₩"
    ? `₩${formattedPrice.toLocaleString(locale)}`
    : `${formattedPrice.toLocaleString(locale)}원`;
};
/**날짜를 YYYY-MM-DD 형식으로 포맷*/
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
/**소수를 퍼센트로 변환 (0.1 → 10%)*/
export const formatPercentage = (rate: number): string => {
  return (rate * 100).toFixed(0) + "%";
};
