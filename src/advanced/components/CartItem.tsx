import { useAtomValue } from 'jotai';
import { CartItem as CartItemType } from '../../types';
import { cartAtom } from '../store/atoms';
import { useCartActions } from '../hooks/useCartActions';
import { useNotificationActions } from '../hooks/useNotificationActions';
import { calculateItemTotal } from '../utils/cartCalculator';
import { CloseIcon } from './common/Icons';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const cart = useAtomValue(cartAtom);
  const { updateQuantity, removeFromCart } = useCartActions();
  const { addNotification } = useNotificationActions();

  const itemTotal = calculateItemTotal(item, cart);
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  const handleUpdateQuantity = (newQuantity: number) => {
    const result = updateQuantity(item.product.id, newQuantity);
    if (result.message) {
      addNotification(result.message, 'error');
    }
  };

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">-{discountRate}%</span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};
