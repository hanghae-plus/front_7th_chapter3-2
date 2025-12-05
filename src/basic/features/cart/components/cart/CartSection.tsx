import { calculateItemTotal } from '../../service/cart.service';
import { CartItem } from '../../../../../types';
import { CartTitle } from './CartTitle';
import { CartEmptyList } from './CartEmptyList';
import { CartItemComponent } from './CartItem';

export const CartSection = ({
  cart,
  removeFromCart,
  updateQuantity,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <CartTitle />

      {cart.length === 0 ? (
        <CartEmptyList />
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const itemTotal = calculateItemTotal(item, cart);
            const originalPrice = item.product.price * item.quantity;

            return (
              <CartItemComponent
                key={item.product.id}
                item={item}
                itemTotal={itemTotal}
                originalPrice={originalPrice}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
