import { formatPrice } from '../../../shared/lib/formatters';
import { Product } from '../model/types';
import { getStockLabel } from './stock';

// 최대 할인율 계산
export const getMaxDiscount = (discounts: Product['discounts']): number => {
  if (!discounts || discounts.length === 0) return 0;
  return Math.max(...discounts.map((d) => d.rate));
};

// 가격 표시 라벨 (품절이면 SOLD OUT, 아니면 가격)
export const getPriceLabel = (
  product: Product,
  usedQuantity: number = 0,
): string => {
  const stockLabel = getStockLabel(product, usedQuantity);
  if (stockLabel) return stockLabel;

  return `₩${formatPrice(product.price)}`;
};
