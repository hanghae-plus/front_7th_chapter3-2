import { type FC } from "react";
import { CartItem as TCartItem } from "../../../../types";
import Button from "../../_common/Button";
import CloseIcon from "../../_icons/CloseIcon";

interface IProps {
  item: TCartItem;
  itemTotal: number;
  hasDiscount: boolean;
  discountRate: number;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItem: FC<IProps> = ({
  item,
  itemTotal,
  hasDiscount,
  discountRate,
  onRemove,
  onUpdateQuantity,
}) => {
  return (
    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <Button
          variant="ghost"
          color="danger"
          size="sm"
          className="ml-2"
          onClick={() => onRemove(item.product.id)}>
          <CloseIcon />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            color="gray"
            size="sm"
            onClick={() =>
              onUpdateQuantity(item.product.id, item.quantity - 1)
            }>
            <span className="text-xs">−</span>
          </Button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            color="gray"
            size="sm"
            onClick={() =>
              onUpdateQuantity(item.product.id, item.quantity + 1)
            }>
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
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
