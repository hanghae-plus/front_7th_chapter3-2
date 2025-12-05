import { Product } from '../../../../types';
import { formatPercentage, formatPrice } from '../../../shared/lib/formatters';
import { ProductWithUI } from './product-interface';
import {
  getFirstDiscountInfo,
  getMaxDiscountRate,
  getStockStatus,
  hasDiscounts,
  isSoldOut,
  StockStatus,
} from './product-utils';
import { ProductViewModel } from './product-view-model';

/** 재고 상태별 배지 CSS 클래스 매핑 */
const STOCK_BADGE_CLASSES: Record<StockStatus, string> = {
  sufficient: 'bg-green-100 text-green-800',
  low: 'bg-yellow-100 text-yellow-800',
  out: 'bg-red-100 text-red-800',
};

/** 재고 상태에 따른 표시 텍스트 생성 */
const getStockDisplayText = (
  remainingStock: number,
  status: StockStatus
): string => {
  if (status === 'out') return '품절';
  if (status === 'low') return `품절임박! ${remainingStock}개 남음`;
  return `재고 ${remainingStock}개`;
};

/** 첫 번째 할인 정보를 사용자 친화적 메시지로 변환 */
const getFirstDiscountMessage = (
  product: Product | ProductWithUI
): string | null => {
  if (!hasDiscounts(product)) return null;

  const discount = getFirstDiscountInfo(product);
  if (!discount) return null;

  return `${discount.quantity}개 이상 구매시 할인 ${formatPercentage(discount.rate)}`;
};

/** Domain Model (Product)를 ViewModel로 변환 */
export const mapProductToViewModel = (
  product: Product | ProductWithUI,
  remainingStock: number
): ProductViewModel => {
  const stockStatus = getStockStatus(remainingStock);
  const maxDiscountRate = getMaxDiscountRate(product);
  const soldOut = isSoldOut(remainingStock);

  return {
    id: product.id,
    name: product.name,
    description: 'description' in product ? product.description : undefined,
    isRecommended: 'isRecommended' in product ? product.isRecommended : false,

    displayPrice: soldOut ? 'SOLD OUT' : formatPrice(product.price),

    maxDiscountBadge:
      maxDiscountRate > 0 ? `~${formatPercentage(maxDiscountRate)}` : null,

    firstDiscountMessage: getFirstDiscountMessage(product),

    stockStatus: {
      status: stockStatus,
      badgeClass: STOCK_BADGE_CLASSES[stockStatus],
      displayText: getStockDisplayText(remainingStock, stockStatus),
      count: remainingStock,
    },

    isAddToCartDisabled: soldOut,
    buttonText: soldOut ? '품절' : '장바구니 담기',
  };
};
