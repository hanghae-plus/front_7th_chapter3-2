import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  clearCart: () => void;
  toast: (notification: ToastProps) => void;
}

export function useOrderCart({ clearCart, toast }: PropsType) {
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
