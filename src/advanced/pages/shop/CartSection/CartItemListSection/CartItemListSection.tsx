import { CartItem } from "./CartItem/CartItem";
import { EmptyCartFallback } from "./EmptyCartFallback/EmptyCartFallback";

type CartItemData = {
  productName: string;
  quantity: number;
  discountRate: number;
  totalPrice: number;
  maxStock: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onDelete: () => void;
};

type CartItemListSectionProps = {
  items: CartItemData[];
};

export function CartItemListSection({ items }: CartItemListSectionProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        장바구니
      </h2>
      {items.length === 0 ? (
        <EmptyCartFallback />
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <CartItem
              key={index}
              productName={item.productName}
              quantity={item.quantity}
              discountRate={item.discountRate}
              totalPrice={item.totalPrice}
              onDecrease={item.onDecrease}
              onIncrease={item.onIncrease}
              onDelete={item.onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
