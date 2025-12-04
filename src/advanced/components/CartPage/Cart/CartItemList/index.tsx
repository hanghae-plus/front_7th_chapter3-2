import { calculateItemTotal } from "../../../../models/cart";
import {
  calculateDiscountRate,
  hasDiscount,
} from "../../../../models/discount";
import { Card } from "../../../ui";
import { EmptyCartIcon, EmptyCartIconSmall } from "../../../icons";
import { CartItem } from "./CartItem";
import { useCart } from "../../../../hooks/useCart";

export const CartItemList = () => {
  const { cart } = useCart();
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <EmptyCartIconSmall className="w-5 h-5 mr-2" />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <EmptyCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = calculateItemTotal(item, cart);
            const originalPrice = item.product.price * item.quantity;
            const itemHasDiscount = hasDiscount(itemTotal, originalPrice);
            const discountRate = calculateDiscountRate(
              itemTotal,
              originalPrice
            );

            return (
              <CartItem
                key={item.product.id}
                item={item}
                itemTotal={itemTotal}
                discountRate={discountRate}
                hasDiscount={itemHasDiscount}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default CartItemList;
