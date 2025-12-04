import { formatPrice } from '../../../../shared/utils/priceUtils';
import { PaymentCompleteButton } from './PaymentCompleteButton';

const PaymentTotalPrice = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{title}</span>
      <span className="font-medium">{formatPrice(value)}원</span>
    </div>
  );
};

const PaymentDiscountedAmount = ({ value }: { value: number }) => {
  return (
    <div className="flex justify-between text-red-500">
      <span>할인 금액</span>
      <span>-{formatPrice(value)}원</span>
    </div>
  );
};

const PaymentFinalAmount = ({ value }: { value: number }) => {
  return (
    <div className="flex justify-between py-2 border-t border-gray-200">
      <span className="font-semibold">결제 예정 금액</span>
      <span className="font-bold text-lg text-gray-900">
        {formatPrice(value)}원
      </span>
    </div>
  );
};
export const PaymentSection = ({
  cartTotalPrice,
  completeOrder,
}: {
  cartTotalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
}) => {
  const { totalBeforeDiscount, totalAfterDiscount } = cartTotalPrice;

  const discountedAmount = totalBeforeDiscount - totalAfterDiscount;
  const paymentAmount = totalAfterDiscount;

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <PaymentTotalPrice title="상품 금액" value={totalBeforeDiscount} />
        {discountedAmount > 0 && (
          <PaymentDiscountedAmount value={discountedAmount} />
        )}
        <PaymentFinalAmount value={paymentAmount} />
      </div>
      <PaymentCompleteButton
        paymentAmount={paymentAmount}
        completeOrder={completeOrder}
      />

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};
