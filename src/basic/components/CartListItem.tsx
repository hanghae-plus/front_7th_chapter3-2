import { CartItem, Product } from "../types";
import { formatDiscount } from "../utils/formatDiscount";
import { formatPriceWon } from "../utils/formatPriceWon";
import { IconClose } from "./icons";

export function CartListItem({
  item,
  itemTotal,
  onRemove,
  onChangeQuantity,
}: {
  item: CartItem;
  itemTotal: number;
  onRemove: (productId: string) => void;
  onChangeQuantity: (product: Product, newQuantity: number) => void;
}) {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <IconClose className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onChangeQuantity(item.product, item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onChangeQuantity(item.product, item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{formatDiscount(discountRate)}
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatPriceWon(itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
