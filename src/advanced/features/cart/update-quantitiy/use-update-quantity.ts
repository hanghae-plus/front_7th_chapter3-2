import { CartItem } from '../../../../types';
import { useCart } from '../../../entities/cart/model/use-cart';
import { useToast } from '../../../shared/ui/toast/toast-context';

export function useUpdateQuantity() {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const handleIncreaseQuantity = (cartItem: CartItem) => {
    const newQuantity = cartItem.quantity + 1;

    const maxStock = cartItem.product.stock;

    if (newQuantity > maxStock) {
      toast({
        message: `재고는 ${maxStock}개까지만 있습니다.`,
        type: 'error',
      });
      return;
    }

    updateQuantity(cartItem.product.id, newQuantity);
  };

  const handleDecreaseQuantity = (cartItem: CartItem) => {
    const newQuantity = cartItem.quantity - 1;

    if (newQuantity <= 0) {
      removeFromCart(cartItem.product.id);

      toast({
        message: '장바구니에서 제거되었습니다',
        type: 'success',
      });
      return;
    }

    updateQuantity(cartItem.product.id, newQuantity);
  };

  return {
    onIncreaseQuantity: handleIncreaseQuantity,
    onDecreaseQuantity: handleDecreaseQuantity,
  };
}
