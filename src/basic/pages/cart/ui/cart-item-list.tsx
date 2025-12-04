import { CartItem } from '../../../entities/cart';
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

/* REFACTOR */
const getMaxApplicableDiscount = (
  cart: CartItemType[],
  item: CartItemType
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

/* REFACTOR */
const calculateItemTotal = (
  cart: CartItemType[],
  item: CartItemType
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(cart, item);

  return Math.round(price * quantity * (1 - discount));
};

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

  return (
    <div className="space-y-3">
      {cart.map((item) => {
        /* REFACTOR */
        const itemTotal = calculateItemTotal(cart, item);
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
