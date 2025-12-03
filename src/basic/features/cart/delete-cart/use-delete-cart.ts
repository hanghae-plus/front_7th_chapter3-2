import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  removeFromCart: (productId: string) => void;
  toast: (notification: ToastProps) => void;
}

export function useDeleteCart({ removeFromCart, toast }: PropsType) {
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
