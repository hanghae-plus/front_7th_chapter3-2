import { CartItem } from '../../../entities/cart/model/types';
import { useCart } from '../../../entities/cart/model/useCart';
import { ToastMessage } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';

interface CartItemControlProps {
  item: CartItem;
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const CartItemControl = ({
  item,
  onShowToast,
}: CartItemControlProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const productId = item.product.id;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    // 재고 체크: 현재 수량이 전체 재고보다 적을 때만 증가
    if (item.quantity < item.product.stock) {
      updateQuantity(productId, item.quantity + 1);
    } else {
      onShowToast?.(`재고는 ${item.product.stock}개까지만 있습니다.`, 'error');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleDecrease}
        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100"
        aria-label="수량 감소"
      >
        <span className="text-xs">−</span>
      </Button>
      <span className="mx-3 text-sm font-medium w-8 text-center">
        {item.quantity}
      </span>
      <Button
        variant="outline"
        onClick={handleIncrease}
        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100"
        aria-label="수량 증가"
      >
        <span className="text-xs">+</span>
      </Button>
    </>
  );
};
