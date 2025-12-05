import { useCart } from '../../../entities/cart/model/useCart';
import { ToastMessage } from '../../../shared/hooks/useToast';
import { formatPrice } from '../../../shared/lib/formatters';
import { Button } from '../../../shared/ui/Button';

interface PlaceOrderButtonProps {
  totalAmount: number;
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
  onOrderComplete?: () => void;
}

export const PlaceOrderButton = ({
  totalAmount,
  onShowToast,
  onOrderComplete,
}: PlaceOrderButtonProps) => {
  const { clearCart } = useCart();

  const handleOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;

    onShowToast?.(
      `주문이 완료되었습니다. 주문 번호: ${orderNumber}`,
      'success',
    );

    clearCart();

    onOrderComplete?.();
  };

  return (
    <Button
      variant="accent"
      size="xl"
      className="w-full mt-4"
      onClick={handleOrder}
    >
      {formatPrice(totalAmount)}원 결제하기
    </Button>
  );
};
