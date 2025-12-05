import React from 'react';
import { CartItem } from '../../../types';
import { CartItemView } from './CartItemView';
import { calculateDiscountRate } from '../../models/discount';

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
  const discountRate = calculateDiscountRate({
    originalPrice,
    discountedPrice: itemTotal,
  });

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
