import { type FC } from "react";
import { CartItem as TCartItem } from "../../../../types";
import CartItemRow from "./CartItem";
import { calculateItemTotal, getCartItemDiscount } from "../../../models/cart";

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
        const { hasDiscount, discountRate } = getCartItemDiscount(cart, item);

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
