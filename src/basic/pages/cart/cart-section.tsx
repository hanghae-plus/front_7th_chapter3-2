import { CartItem } from '../../../types';
import { ToastProps } from '../../shared/ui/toast';
import { ConditionalRender } from '../../shared/ui/conditional-render/conditional-render';
import { CartEmptyFallback } from './cart-empty-fallback';
import { CartItemList } from './cart-item-list';

interface PropsType {
  cart: CartItem[];
  toast: (notification: ToastProps) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

export function CartSection({
  cart,
  toast,
  removeFromCart,
  updateQuantity,
}: PropsType) {
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
      <ConditionalRender
        condition={cart.length > 0}
        fallback={<CartEmptyFallback />}
      >
        <CartItemList
          cart={cart}
          toast={toast}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      </ConditionalRender>
    </section>
  );
}
