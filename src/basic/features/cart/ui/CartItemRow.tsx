import { calculateItemTotal, CartItem, CartValidation } from '@/features/cart';
import { Notification } from '@/shared/hooks';
import { formatPrice } from '@/shared/utils';
import { useMemo } from 'react';

export const CartItemRow = ({
  cartItem,
  cart,
  removeFromCart,
  updateQuantity,
  addNotification,
}: {
  cartItem: CartItem;
  cart: CartItem[];
  removeFromCart: (
    productId: string,
    options?: {
      onSuccess?: (validation: CartValidation) => void;
      onError?: (validation: CartValidation) => void;
    }
  ) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    options?: {
      onSuccess?: (validation: CartValidation) => void;
      onError?: (validation: CartValidation) => void;
    }
  ) => void;
  addNotification: (message: string, type: Notification['type']) => void;
}) => {
  const itemTotal = useMemo(
    () => calculateItemTotal(cartItem, cart),
    [cartItem, cart]
  );

  const originalPrice = cartItem.product.price * cartItem.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  const handleRemove = () => {
    removeFromCart(cartItem.product.id, {
      onSuccess: ({ message }) =>
        addNotification(message || '장바구니에서 삭제되었습니다', 'success'),
      onError: ({ message }) => addNotification(message, 'error'),
    });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(cartItem.product.id, newQuantity, {
      onSuccess: ({ message }) =>
        addNotification(message || '수량이 변경되었습니다', 'success'),
      onError: ({ message }) => addNotification(message, 'error'),
    });
  };

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {cartItem.product.name}
        </h4>
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {cartItem.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(itemTotal)}원
          </p>
        </div>
      </div>
    </div>
  );
};
