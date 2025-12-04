import React from 'react';
import { ProductWithUI } from '../../hooks/useProducts';
import { ProductCardView } from './ProductCardView';
import { useProductsContext, useCartContext } from '../../contexts';
import { formatCurrencyKRW } from '../../utils/formatters';
import { getRemainingStock } from '../../models/cart';
import {
  isOutOfStock,
  isLowStock,
  getProductMaxDiscountRate,
} from '../../models/product';
import { formatDiscountRate } from '../../models/discount';

interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  onAddToCart: (product: ProductWithUI) => void;
}

export const ProductCardContainer: React.FC<ProductCardProps> = ({
  product,
  remainingStock,
  onAddToCart,
}) => {
  const { products } = useProductsContext();
  const { cart } = useCartContext();

  const formatPrice = (price: number, productId?: string): string => {
    if (!productId) return formatCurrencyKRW(price);

    const foundProduct = products.find((p) => p.id === productId);
    if (!foundProduct) return formatCurrencyKRW(price);

    const remaining = getRemainingStock({ product: foundProduct, cart });
    const outOfStock = isOutOfStock(remaining);
    const cartItem = cart.find((item) => item.product.id === productId);
    const quantity = cartItem?.quantity || 0;

    return outOfStock
      ? `${formatCurrencyKRW(price)} (품절)`
      : `${formatCurrencyKRW(price)} (재고: ${remaining - quantity})`;
  };

  const maxDiscountRate = getProductMaxDiscountRate(product) * 100;

  const discountText =
    product.discounts.length > 0
      ? `${
          product.discounts[0].quantity
        }개 이상 구매시 할인 ${formatDiscountRate(product.discounts[0].rate)}`
      : undefined;

  const stockStatus = isOutOfStock(remainingStock)
    ? 'out'
    : isLowStock(remainingStock)
    ? 'low'
    : 'available';

  const stockStatusText = isOutOfStock(remainingStock)
    ? '품절'
    : isLowStock(remainingStock)
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
