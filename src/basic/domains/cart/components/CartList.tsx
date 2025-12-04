import { CartItem as CartItemType } from "../../../types";
import { CartItem } from "./CartItem";

interface CartListProps {
  cart: CartItemType[];
  calculateItemTotal: (item: CartItemType) => number;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartList({
  cart,
  calculateItemTotal,
  onRemove,
  onUpdateQuantity,
}: CartListProps) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cart.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          itemTotal={calculateItemTotal(item)}
          onRemove={onRemove}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
