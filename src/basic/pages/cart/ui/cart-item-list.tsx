import {
  CartItem,
  calculateItemTotal,
  hasBulkDiscount,
} from '../../../entities/cart';
import { CartItem as CartItemType } from '../../../../types';
import { useDeleteCart } from '../../../features/cart/delete-cart';
import { useUpdateQuantity } from '../../../features/cart/update-quantitiy';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  cart: CartItemType[];
  toast: (notification: ToastProps) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

export function CartItemList({
  cart,
  toast,
  removeFromCart,
  updateQuantity,
}: PropsType) {
  const { onDeleteCart } = useDeleteCart({ removeFromCart, toast });

  const { onIncreaseQuantity, onDecreaseQuantity } = useUpdateQuantity({
    updateQuantity,
    removeFromCart,
    toast,
  });

  const isBulkPurchase = hasBulkDiscount(cart);

  return (
    <div className="space-y-3">
      {cart.map((item) => {
        const itemTotal = calculateItemTotal(item, isBulkPurchase);
        const originalPrice = item.product.price * item.quantity;
        const hasDiscount = itemTotal < originalPrice;
        const discountRate = hasDiscount
          ? Math.round((1 - itemTotal / originalPrice) * 100)
          : 0;

        return (
          <CartItem
            key={item.product.id}
            item={item}
            hasDiscount={hasDiscount}
            discountRate={discountRate}
            itemTotal={itemTotal}
            onDeleteCart={() => onDeleteCart(item.product.id)}
            onDecreaseQuantity={() => onDecreaseQuantity(item)}
            onIncreaseQuantity={() => onIncreaseQuantity(item)}
          />
        );
      })}
    </div>
  );
}
