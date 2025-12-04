import { Button } from "../../../shared/components/ui/Button";

interface CartCheckoutProps {
  totalAfterDiscount: number;
  onCheckout: () => void;
}

export function CartCheckout({
  totalAfterDiscount,
  onCheckout,
}: CartCheckoutProps) {
  return (
    <>
      <Button
        onClick={onCheckout}
        variant="success"
        className="w-full mt-4"
        size="lg"
      >
        {totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </>
  );
}
