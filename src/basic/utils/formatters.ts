type KRWFormatType = 'prefix' | 'suffix';

export const formatPriceKRW = (value: number, type: KRWFormatType = 'suffix'): string => {
  if (value === null || value === undefined) return '';
  const num = Number(value);
  if (Number.isNaN(num)) return '';

  const formatted = num.toLocaleString('ko-KR');

  return type === 'prefix' ? `₩${formatted}` : `${formatted}원`;
};
