export const formatPriceWon = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

// SOLD OUT이랑 아닐 때 ₩10,000 으로 포맷팅
export const formatProductPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};
