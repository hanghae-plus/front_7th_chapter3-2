import { useCart } from '../../../entities/cart/model/use-cart';
import { useToast } from '../../../shared/ui/toast/toast-context';

export function useOrderCart() {
  const { clearCart } = useCart();
  const { toast } = useToast();

  const handleOrderCart = () => {
    try {
      const orderNumber = `ORD-${Date.now()}`;

      clearCart();

      toast({
        message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        message: '주문에 실패했습니다.',
        type: 'error',
      });
    }
  };
  return {
    onOrderCart: handleOrderCart,
  };
}
