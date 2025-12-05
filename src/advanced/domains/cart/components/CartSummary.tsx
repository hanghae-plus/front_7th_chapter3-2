interface CartSummaryProps {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export function CartSummary({
  totalBeforeDiscount,
  totalAfterDiscount,
}: CartSummaryProps) {
  const discountAmount = totalBeforeDiscount - totalAfterDiscount;
  console.log("CartSummary: totalBeforeDiscount", totalBeforeDiscount);
  console.log("CartSummary: totalAfterDiscount", totalAfterDiscount);
  console.log("CartSummary: discountAmount", discountAmount);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">상품 금액</span>
        <span className="font-medium">
          {totalBeforeDiscount.toLocaleString()}원
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
          {totalAfterDiscount.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
