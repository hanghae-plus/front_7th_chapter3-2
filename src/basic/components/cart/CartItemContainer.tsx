import React from 'react';
import { CartItem } from '../../../types';
import { CartItemView } from './CartItemView';

interface CartItemContainerProps {
  item: CartItem;
  itemTotal: number;
  originalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemContainer: React.FC<CartItemContainerProps> = ({
  item,
  itemTotal,
  originalPrice,
  onUpdateQuantity,
  onRemove,
}) => {
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  return (
    <CartItemView
      productName={item.product.name}
      quantity={item.quantity}
      totalPrice={itemTotal}
      discountRate={discountRate}
      onIncrease={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
      onDecrease={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
      onRemove={() => onRemove(item.product.id)}
    />
  );
};
