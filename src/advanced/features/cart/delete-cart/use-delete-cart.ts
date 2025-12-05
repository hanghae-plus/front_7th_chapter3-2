import { useCart } from '../../../entities/cart/model/use-cart';
import { useToast } from '../../../shared/ui/toast/toast-context';

export function useDeleteCart() {
  const { removeFromCart } = useCart();
  const { toast } = useToast();

  const handleDeleteCart = (productId: string) => {
    try {
      removeFromCart(productId);

      toast({
        message: '장바구니에서 제거되었습니다',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
    }
  };
  return {
    onDeleteCart: handleDeleteCart,
  };
}
