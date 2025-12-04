import { useCartStore } from '../../../entities/cart/model/useCartStore';
import { useProductStore } from '../../../entities/product/model/useProductStore';
import { useNotificationStore } from '../../../shared/store/useNotificationStore';
import CartItem from './CartItem';

const CartList = () => {
  const cart = useCartStore((state) => state.cart);
  const calculateItemTotal = useCartStore((state) => state.calculateItemTotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const products = useProductStore((state) => state.products);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantity(productId, quantity, products);
    if (!result.success && result.message) {
      addNotification(result.message, 'error');
    }
  };

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
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={removeFromCart}
          />
        );
      })}
    </div>
  );
};

export default CartList;
