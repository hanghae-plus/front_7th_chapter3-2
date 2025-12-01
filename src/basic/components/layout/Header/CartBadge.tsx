import { type FC } from "react";
import CartIcon from "../../icons/CartIcon";
import { CartItem } from "../../../../types";

interface IProps {
  cart: CartItem[];
}

const CartBadge: FC<IProps> = ({ cart }) => {
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      <CartIcon />
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItemCount}
        </span>
      )}
    </div>
  );
};

export default CartBadge;
