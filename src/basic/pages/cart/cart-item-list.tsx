import { CartItem } from '../../../types';
import { useDeleteCart } from '../../features/cart/delete-cart';
import { useUpdateQuantity } from '../../features/cart/update-quantitiy';
import { ToastProps } from '../../shared/ui/toast';

interface PropsType {
  cart: CartItem[];
  toast: (notification: ToastProps) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

/* REFACTOR */
const getMaxApplicableDiscount = (cart: CartItem[], item: CartItem): number => {
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
const calculateItemTotal = (cart: CartItem[], item: CartItem): number => {
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
          <div key={item.product.id} className="border-b pb-3 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium text-gray-900 flex-1">
                {item.product.name}
              </h4>
              <button
                onClick={() => onDeleteCart(item.product.id)}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => onDecreaseQuantity(item)}
                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <span className="text-xs">−</span>
                </button>
                <span className="mx-3 text-sm font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onIncreaseQuantity(item)}
                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <span className="text-xs">+</span>
                </button>
              </div>
              <div className="text-right">
                {/* REFACTOR */}
                {hasDiscount && (
                  <span className="text-xs text-red-500 font-medium block">
                    -{discountRate}%
                  </span>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {/* REFACTOR */}
                  {Math.round(itemTotal).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
