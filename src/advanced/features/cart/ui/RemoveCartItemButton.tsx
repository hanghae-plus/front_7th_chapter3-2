import { useCart } from '../../../entities/cart/model/useCart';
import { useToast } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';
import { CloseIcon } from '../../../shared/ui/Icons';

interface RemoveCartItemButtonProps {
  productId: string;
}

export const RemoveCartItemButton = ({
  productId,
}: RemoveCartItemButtonProps) => {
  const { removeFromCart } = useCart();
  const { addToast } = useToast();

  const handleRemove = () => {
    removeFromCart(productId);
    addToast('상품이 삭제되었습니다.', 'success');
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
