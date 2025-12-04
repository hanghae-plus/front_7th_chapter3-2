import { CartItemWithUI } from '../../../entities/cart/model/cart';
import CartItem from './CartItem';

type CartListProps = {
  cart: CartItemWithUI[];
  calculateItemTotal: (item: CartItemWithUI) => number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

const CartList = ({
  cart,
  calculateItemTotal,
  onUpdateQuantity,
  onRemove,
}: CartListProps) => {
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
      {cart.map((item) => {
        const itemTotal = calculateItemTotal(item);
        const originalPrice = item.product.price * item.quantity;
        const hasDiscount = itemTotal < originalPrice;
        const discountRate = hasDiscount
          ? Math.round((1 - itemTotal / originalPrice) * 100)
          : 0;

        return (
          <CartItem
            key={item.product.id}
            item={item}
            itemTotal={itemTotal}
            discountRate={discountRate}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
};

export default CartList;
