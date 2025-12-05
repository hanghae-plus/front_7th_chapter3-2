import type { CartItem as CartItemType } from '../../../types';
import { useCart, useProduct, useNotification } from '../../hooks';
import { getAppliedDiscountRate } from '../../models';

interface CartItemProps {
  item: CartItemType;
}

/**
 * 장바구니 아이템 컴포넌트
 *
 * 단일 장바구니 아이템을 렌더링합니다.
 * - 전역 상태에서 직접 액션 접근
 * - item만 props로 받음 (어떤 아이템인지 명시)
 */
export const CartItemComponent = ({ item }: CartItemProps) => {
  const { cart, updateQuantity, removeFromCart, getItemTotal } = useCart();
  const { products } = useProduct();
  const { addNotification } = useNotification();

  const itemTotal = getItemTotal(item);
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  // getAppliedDiscountRate는 이미 퍼센트 값을 반환함 (0~100)
  const discountRate = getAppliedDiscountRate(item, cart);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.id);
      return;
    }

    const product = products.find(p => p.id === item.product.id);
    if (!product) return;

    if (newQuantity > product.stock) {
      addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
      return;
    }

    updateQuantity(item.product.id, newQuantity);
  };

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => removeFromCart(item.product.id)}
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
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};
