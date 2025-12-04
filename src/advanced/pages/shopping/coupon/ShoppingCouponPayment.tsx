import { Button } from "../../../components/common/ui/Button";
import { calculatePaymentViewData } from "../../../utils/viewData";
import { formatPriceWithUnit } from "../../../utils/formatters";
import { useCart } from "../../../hooks/useCart";
import { useCoupons } from "../../../hooks/useCoupons";
import { useNotification } from "../../../hooks/useNotification";

export const ShoppingCouponPayment = () => {
  const { cart, setCart } = useCart();
  const { selectedCoupon, setSelectedCoupon } = useCoupons();
  const { addNotification } = useNotification();

  const paymentViewData = calculatePaymentViewData(cart, selectedCoupon);

  const handleOrderComplete = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">
            {formatPriceWithUnit(paymentViewData.totalBeforeDiscount)}
          </span>
        </div>
        {paymentViewData.hasDiscount && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>
              -{formatPriceWithUnit(paymentViewData.discountAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">
            {formatPriceWithUnit(paymentViewData.totalAfterDiscount)}
          </span>
        </div>
      </div>

      <Button
        onClick={handleOrderComplete}
        variant="warning"
        fullWidth
        className="mt-4"
      >
        {formatPriceWithUnit(paymentViewData.totalAfterDiscount)} 결제하기
      </Button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};
