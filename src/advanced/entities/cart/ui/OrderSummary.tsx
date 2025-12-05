import { ReactNode } from 'react';
import { formatPrice } from '../../../shared/lib/formatters';

interface OrderSummaryProps {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  action?: ReactNode; // 결제하기 버튼 Slot
}

export const OrderSummary = ({
  totalBeforeDiscount,
  totalAfterDiscount,
  action,
}: OrderSummaryProps) => {
  const discountAmount = totalBeforeDiscount - totalAfterDiscount;

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">
            {formatPrice(totalBeforeDiscount)}원
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{formatPrice(discountAmount)}원</span>
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">
            {formatPrice(totalAfterDiscount)}원
          </span>
        </div>
      </div>

      {action && <div className="mt-4">{action}</div>}

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};
