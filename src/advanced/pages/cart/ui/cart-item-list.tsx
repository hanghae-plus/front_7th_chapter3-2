import {
  CartItem,
  calculateItemTotal,
  hasBulkDiscount,
} from '../../../entities/cart';
import { useCart } from '../../../entities/cart/model/use-cart';
import { useDeleteCart } from '../../../features/cart/delete-cart';
import { useUpdateQuantity } from '../../../features/cart/update-quantitiy';

export function CartItemList() {
  const { cart } = useCart();
  const { onDeleteCart } = useDeleteCart();
  const { onIncreaseQuantity, onDecreaseQuantity } = useUpdateQuantity();

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
