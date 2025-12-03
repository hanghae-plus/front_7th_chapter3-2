import { ProductWithUI } from '../../../entities/product';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  addToCart: (product: ProductWithUI) => void;
  toast: (notification: ToastProps) => void;
}

export function useAddCart({ addToCart, toast }: PropsType) {
  const handleAddCart = (product: ProductWithUI) => {
    try {
      addToCart(product);

      toast({
        message: '장바구니에 담았습니다',
        type: 'success',
      });
    } catch (error) {
      console.error(error);

      toast({
        message: error instanceof Error ? error.message : '장바구니 담기 실패',
        type: 'error',
      });
    }
  };
  return {
    handleAddCart,
  };
}
