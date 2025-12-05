import { Product } from '../model/types';

// 남은 재고 계산
export const getRemainingStock = (
  product: Product,
  usedQuantity: number,
): number => {
  return product.stock - usedQuantity;
};

// 재고 상태 라벨 반환
export const getStockLabel = (
  product: Product,
  usedQuantity: number,
): string => {
  const remaining = getRemainingStock(product, usedQuantity);
  return remaining <= 0 ? 'SOLD OUT' : '';
};
