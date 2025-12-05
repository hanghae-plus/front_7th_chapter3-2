import { getRemainingStockInCart } from '../../../entities/cart/lib';
import { useCart } from '../../../entities/cart/model/useCart';
import { Product } from '../../../entities/product/model/types';
import { ToastMessage } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';

interface AddToCartButtonProps {
  product: Product;
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const AddToCartButton = ({
  product,
  onShowToast,
}: AddToCartButtonProps) => {
  const { cart, addToCart } = useCart();

  const remainingStock = getRemainingStockInCart(product, cart);
  const isSoldOut = remainingStock <= 0;

  const handleAddToCart = () => {
    if (isSoldOut) {
      onShowToast?.(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
      return;
    }
    addToCart(product);
    onShowToast?.('장바구니에 담았습니다', 'success');
  };

  return (
    <Button
      size="lg"
      variant="dark"
      onClick={handleAddToCart}
      disabled={isSoldOut}
      className="w-full"
    >
      {isSoldOut ? '품절' : '장바구니 담기'}
    </Button>
  );
};
