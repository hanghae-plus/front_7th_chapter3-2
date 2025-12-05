import { CartItem as CartItemType } from '../../../../types';
import { formatPrice } from '../../../shared/lib/formatters';
import { XIcon } from '../../../shared/ui/icons';
import { Button } from '../../../shared/ui/button';

interface CartItemProps {
  item: CartItemType;
  onDeleteCart: () => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  hasDiscount: boolean;
  discountRate: number;
  itemTotal: number;
}

export function CartItem({
  item,
  hasDiscount,
  discountRate,
  itemTotal,
  onDeleteCart,
  onDecreaseQuantity,
  onIncreaseQuantity,
}: CartItemProps) {
  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteCart}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <XIcon />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDecreaseQuantity}
            className="border border-gray-300"
          >
            <span className="text-xs">−</span>
          </Button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onIncreaseQuantity}
            className="border border-gray-300"
          >
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}

          <p className="text-sm font-medium text-gray-900">
            {formatPrice(itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
