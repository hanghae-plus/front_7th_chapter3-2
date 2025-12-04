import React from 'react';
import { ProductWithUI } from '../../hooks/useProducts';
import { ProductCardView } from './ProductCardView';

interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
}

/**
 * ProductCard Container Component
 * - 비즈니스 로직: 최대 할인율 계산, 재고 상태 판단, 재고 메시지 생성
 * - Pure UI는 ProductCardView로 위임
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  remainingStock,
  formatPrice,
  onAddToCart,
}) => {
  // 비즈니스 로직: 최대 할인율 계산
  const maxDiscountRate =
    product.discounts.length > 0
      ? Math.max(...product.discounts.map((d) => d.rate)) * 100
      : 0;

  // 비즈니스 로직: 할인 정보 텍스트
  const discountText =
    product.discounts.length > 0
      ? `${product.discounts[0].quantity}개 이상 구매시 할인 ${
          product.discounts[0].rate * 100
        }%`
      : undefined;

  // 비즈니스 로직: 재고 상태 판단
  const stockStatus =
    remainingStock === 0 ? 'out' : remainingStock <= 5 ? 'low' : 'available';

  // 비즈니스 로직: 재고 상태 텍스트
  const stockStatusText =
    remainingStock === 0
      ? '품절'
      : remainingStock <= 5
      ? `품절임박! ${remainingStock}개 남음`
      : `재고 ${remainingStock}개`;

  return (
    <ProductCardView
      name={product.name}
      description={product.description}
      priceText={formatPrice(product.price, product.id)}
      discountText={discountText}
      maxDiscountRate={maxDiscountRate}
      isRecommended={product.isRecommended ?? false}
      stockStatusText={stockStatusText}
      stockStatus={stockStatus}
      onAddToCart={() => onAddToCart(product)}
    />
  );
};
