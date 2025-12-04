import { CartItem as CartItemType } from "../../../../../types";
import { QuantityControl } from "../../../ui";
import { CloseIcon } from "../../../icons";

interface CartItemProps {
  item: CartItemType;
  itemTotal: number;
  discountRate: number;
  hasDiscount: boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const CartItem = ({
  item,
  itemTotal,
  discountRate,
  hasDiscount,
  removeFromCart,
  updateQuantity,
}: CartItemProps) => {
  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
          onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
        />
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
