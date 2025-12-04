import React from 'react';
import { Badge, Button, Card } from '../primitives';

interface ProductCardViewProps {
  /** 상품명 */
  name: string;
  /** 설명 (optional) */
  description?: string;
  /** 가격 표시 텍스트 (포맷팅 완료) */
  priceText: string;
  /** 할인 정보 텍스트 (optional) */
  discountText?: string;
  /** 최대 할인율 (0이면 할인 없음) */
  maxDiscountRate: number;
  /** 추천 상품 여부 */
  isRecommended: boolean;
  /** 재고 상태 텍스트 (품절임박!, 재고 N개, 품절 등) */
  stockStatusText: string;
  /** 재고 상태 타입 */
  stockStatus: 'available' | 'low' | 'out';
  /** 장바구니 담기 핸들러 */
  onAddToCart: () => void;
}

export const ProductCardView: React.FC<ProductCardViewProps> = ({
  name,
  description,
  priceText,
  discountText,
  maxDiscountRate,
  isRecommended,
  stockStatusText,
  stockStatus,
  onAddToCart,
}) => {
  return (
    <Card hoverable>
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {isRecommended && (
          <span className="absolute top-2 right-2">
            <Badge variant="danger">BEST</Badge>
          </span>
        )}
        {maxDiscountRate > 0 && (
          <span className="absolute top-2 left-2">
            <Badge variant="warning">~{maxDiscountRate}%</Badge>
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{priceText}</p>
          {discountText && (
            <p className="text-xs text-gray-500">{discountText}</p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          <p
            className={`text-xs font-medium ${
              stockStatus === 'low'
                ? 'text-red-600'
                : stockStatus === 'available'
                ? 'text-gray-500'
                : 'text-gray-400'
            }`}
          >
            {stockStatusText}
          </p>
        </div>

        {/* 장바구니 버튼 */}
        <Button
          variant="primary"
          fullWidth
          onClick={onAddToCart}
          disabled={stockStatus === 'out'}
        >
          {stockStatus === 'out' ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </Card>
  );
};
