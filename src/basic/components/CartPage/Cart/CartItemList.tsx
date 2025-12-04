import { CartItem } from "../../../../types";
import { calculateItemTotal } from "../../../models/cart";
import { calculateDiscountRate, hasDiscount } from "../../../models/discount";
import { Card, QuantityControl } from "../../ui";
import { CloseIcon, EmptyCartIcon, EmptyCartIconSmall } from "../../icons";

interface CartItemListProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const CartItemList = ({
  cart,
  removeFromCart,
  updateQuantity,
}: CartItemListProps) => {
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
              <div
                key={item.product.id}
                className="border-b pb-3 last:border-b-0"
              >
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
                    onDecrease={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    onIncrease={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  />
                  <div className="text-right">
                    {itemHasDiscount && (
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
          })}
        </div>
      )}
    </Card>
  );
};

export default CartItemList;
