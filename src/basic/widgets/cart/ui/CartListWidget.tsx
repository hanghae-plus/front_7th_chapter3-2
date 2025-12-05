import { useState } from 'react';
import { useCart } from '../../../entities/cart/model/useCart';
import { useCouponList } from '../../../entities/coupon/model/useCouponList';
import { getCartSummary } from '../../../entities/cart/lib/summary';
import { CartItem } from '../../../entities/cart/ui/CartItem';
import { CartHeader } from '../../../entities/cart/ui/CartHeader';
import { EmptyCart } from '../../../entities/cart/ui/EmptyCart';
import { OrderSummary } from '../../../entities/cart/ui/OrderSummary';
import { CouponSelect } from '../../../entities/coupon/ui/CouponSelect';
import { Coupon } from '../../../entities/coupon/model/types';
import { CartItemControl } from '../../../features/cart/ui/CartItemControl';
import { RemoveCartItemButton } from '../../../features/cart/ui/RemoveCartItemButton';
import { PlaceOrderButton } from '../../../features/order/ui/PlaceOrderButton';
import { ToastMessage } from '../../../shared/hooks/useToast';

interface CartListWidgetProps {
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const CartListWidget = ({ onShowToast }: CartListWidgetProps) => {
  const { cart } = useCart();
  const { coupons } = useCouponList();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const totals = getCartSummary(cart, selectedCoupon);

  const handleOrderComplete = () => {
    setSelectedCoupon(null);
  };

  if (cart.length === 0) {
    return (
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <CartHeader />
        <EmptyCart />
      </section>
    );
  }

  return (
    <div className="sticky top-24 space-y-4">
      {/* 장바구니 목록 */}
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <CartHeader />
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              cart={cart}
              control={
                <CartItemControl item={item} onShowToast={onShowToast} />
              }
              action={
                <RemoveCartItemButton
                  productId={item.product.id}
                  onShowToast={onShowToast}
                />
              }
            />
          ))}
        </div>
      </section>

      {/* 쿠폰 선택 */}
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">쿠폰 할인</h3>
        <CouponSelect
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onChange={setSelectedCoupon}
        />
      </section>

      {/* 결제 정보 */}
      <OrderSummary
        totalBeforeDiscount={totals.totalBeforeDiscount}
        totalAfterDiscount={totals.totalAfterDiscount}
        action={
          <PlaceOrderButton
            totalAmount={totals.totalAfterDiscount}
            onShowToast={onShowToast}
            onOrderComplete={handleOrderComplete}
          />
        }
      />
    </div>
  );
};
