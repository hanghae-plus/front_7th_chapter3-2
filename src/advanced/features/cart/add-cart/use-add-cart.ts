import { ProductWithUI } from '../../../entities/product';
import { useCart } from '../../../entities/cart/model/use-cart';
import { useToast } from '../../../shared/ui/toast/toast-context';

export function useAddCart() {
  const { addToCart } = useCart();
  const { toast } = useToast();

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
