import { Notification } from '@/shared/hooks/useNotifications';
import { CartItemRow } from '@/features/cart/ui/CartItemRow';
import { CartItem, CartValidation } from '@/types';

const EmptyCart = () => {
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
};

export const CartItemList = ({
  cart,
  updateQuantity,
  removeFromCart,
  addNotification,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => CartValidation;
  updateQuantity: (productId: string, newQuantity: number) => CartValidation;
  addNotification: (message: string, type: Notification['type']) => void;
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        장바구니
      </h2>
      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItemRow
              key={item.product.id}
              cartItem={item}
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              addNotification={addNotification}
            />
          ))}
        </div>
      )}
    </section>
  );
};
