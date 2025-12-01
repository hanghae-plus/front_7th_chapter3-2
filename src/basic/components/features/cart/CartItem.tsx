import { CartItem as CartItemType } from '../../../../types';
import { CloseIcon } from '../../icons';

interface CartItemProps {
  item: CartItemType;
  itemTotal: number;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  formatPrice: (price: number) => string;
}

// 장바구니 아이템을 표시하는 컴포넌트
export const CartItem = ({
  item,
  itemTotal,
  onRemove,
  onUpdateQuantity,
  formatPrice
}: CartItemProps) => {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
        <button 
          onClick={onRemove} 
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => onUpdateQuantity(item.quantity - 1)} 
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.quantity + 1)} 
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">-{discountRate}%</span>
          )}
          {hasDiscount && (
            <p className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</p>
          )}
          <p className="text-sm font-semibold text-gray-900">{formatPrice(itemTotal)}</p>
        </div>
      </div>
    </div>
  );
};

