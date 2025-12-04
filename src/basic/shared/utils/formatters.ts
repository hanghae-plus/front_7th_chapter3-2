export const formatPrice = (price: number | string) => {
  return Number(price).toLocaleString();
};
export const formatDate = (date: Date) => {
  if (!(date instanceof Date)) return null; // 유효성 검사
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
export const formatPercentage = (rate: number) => {
  return `${Number(rate) * 100}%`;
};
