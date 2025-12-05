import React from 'react';
import { ProductWithUI } from '../../hooks/useProducts';
import { ProductCardView } from './ProductCardView';

interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
}

export const ProductCardContainer: React.FC<ProductCardProps> = ({
  product,
  remainingStock,
  formatPrice,
  onAddToCart,
}) => {
  // 최대 할인율 계산
  const maxDiscountRate =
    product.discounts.length > 0
      ? Math.max(...product.discounts.map((d) => d.rate)) * 100
      : 0;

  // 할인 정보 텍스트
  const discountText =
    product.discounts.length > 0
      ? `${product.discounts[0].quantity}개 이상 구매시 할인 ${
          product.discounts[0].rate * 100
        }%`
      : undefined;

  // 재고 상태 판단
  const stockStatus =
    remainingStock === 0 ? 'out' : remainingStock <= 5 ? 'low' : 'available';

  // 재고 상태 텍스트
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
