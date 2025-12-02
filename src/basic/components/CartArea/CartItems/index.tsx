import { type FC } from "react";
import { CartItem as TCartItem } from "../../../../types"; // 타입 이름 변경
import CartItemRow from "./CartItem";
import { calculateItemTotal } from "../../../models/cart";

interface IProps {
  cart: TCartItem[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItems: FC<IProps> = ({ cart, onRemove, onUpdateQuantity }) => {
  return (
    <div className="space-y-3">
      {cart.map((item) => {
        const itemTotal = calculateItemTotal(cart, item);
        const originalPrice = item.product.price * item.quantity;
        const hasDiscount = itemTotal < originalPrice;
        const discountRate = hasDiscount
          ? Math.round((1 - itemTotal / originalPrice) * 100)
          : 0;

        return (
          <CartItemRow
            key={item.product.id}
            item={item}
            itemTotal={itemTotal}
            hasDiscount={hasDiscount}
            discountRate={discountRate}
            onRemove={onRemove}
            onUpdateQuantity={onUpdateQuantity}
          />
        );
      })}
    </div>
  );
};

export default CartItems;
