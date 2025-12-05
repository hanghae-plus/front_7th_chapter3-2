import { useCart } from '../../../entities/cart/model/useCart';
import { ToastMessage } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';
import { CloseIcon } from '../../../shared/ui/Icons';

interface RemoveCartItemButtonProps {
  productId: string;
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const RemoveCartItemButton = ({
  productId,
  onShowToast,
}: RemoveCartItemButtonProps) => {
  const { removeFromCart } = useCart();

  const handleRemove = () => {
    removeFromCart(productId);
    onShowToast?.('상품이 삭제되었습니다.', 'success');
  };

  return (
    <Button
      variant="delete"
      onClick={handleRemove}
      aria-label="장바구니 아이템 삭제"
    >
      <CloseIcon />
    </Button>
  );
};
