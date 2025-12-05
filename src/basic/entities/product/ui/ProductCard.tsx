import { ReactNode } from 'react';
import { Product } from '../model/types';
import { getMaxDiscount, getPriceLabel, getRemainingStock } from '../lib';
import { Badge } from '../../../shared/ui/Badge';
import { ImageIcon } from '../../../shared/ui/Icons';

interface ProductCardProps {
  product: Product;
  usedQuantity?: number;
  action: ReactNode; // 장바구니 담기 버튼 Slot
}

export const ProductCard = ({
  product,
  usedQuantity = 0,
  action,
}: ProductCardProps) => {
  const remainingStock = getRemainingStock(product, usedQuantity);
  const priceLabel = getPriceLabel(product, usedQuantity);
  const maxDiscountRate = getMaxDiscount(product.discounts);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {/* 이미지 Placeholder */}
          <ImageIcon className="text-gray-300" />
        </div>

        {product.isRecommended && <Badge variant="best">BEST</Badge>}

        {maxDiscountRate > 0 && (
          <Badge variant="discount">
            ~{Math.round(maxDiscountRate * 100)}%
          </Badge>
        )}
      </div>
      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{priceLabel}</p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{' '}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>
        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>
        {/* 장바구니 버튼 */}
        {action && <div className="w-full">{action}</div>}
      </div>
    </div>
  );
};
