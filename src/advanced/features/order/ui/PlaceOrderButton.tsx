import { useCart } from '../../../entities/cart/model/useCart';
import { useToast } from '../../../shared/hooks/useToast';
import { formatPrice } from '../../../shared/lib/formatters';
import { Button } from '../../../shared/ui/Button';

interface PlaceOrderButtonProps {
  totalAmount: number;
  onOrderComplete?: () => void;
}

export const PlaceOrderButton = ({
  totalAmount,
  onOrderComplete,
}: PlaceOrderButtonProps) => {
  const { clearCart } = useCart();
  const { addToast } = useToast();

  const handleOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;

    addToast(`주문이 완료되었습니다. 주문 번호: ${orderNumber}`, 'success');

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
