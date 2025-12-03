import { type FC } from "react";
import { calculateDiscountAmount } from "../../models/cart";
import Button from "../_common/Button";

interface IProps {
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  onCheckout: () => void;
}

const PayItem: FC<IProps> = ({ totals, onCheckout }) => {
  const discountAmount = calculateDiscountAmount(
    totals.totalBeforeDiscount,
    totals.totalAfterDiscount
  );

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">
            {totals.totalBeforeDiscount.toLocaleString()}원
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{discountAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">
            {totals.totalAfterDiscount.toLocaleString()}원
          </span>
        </div>
      </div>

      <Button size="lg" className="w-full mt-4" onClick={onCheckout}>
        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};

export default PayItem;
