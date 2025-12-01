import { CartItem as CartItemType, Coupon } from '../../../../types';
import { CartItem } from './CartItem';
import { CouponSelector } from '../coupon/CouponSelector';
import { Button } from '../../ui/Button';
import { CartIconSimple } from '../../icons';
import { calculateItemTotal } from '../../../models/cart';

interface CartProps {
  cart: CartItemType[];
  selectedCoupon: Coupon | null;
  total: { totalBeforeDiscount: number; totalAfterDiscount: number };
  coupons: Coupon[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  onApplyCoupon: (coupon: Coupon) => void;
  onSetSelectedCoupon: (coupon: Coupon | null) => void;
  onClearCart: () => void;
  onOrder: () => void;
  formatPrice: (price: number) => string;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

// 장바구니 섹션 컴포넌트
export const Cart = ({
  cart,
  selectedCoupon,
  total,
  coupons,
  onRemoveItem,
  onUpdateQuantity,
  onApplyCoupon,
  onSetSelectedCoupon,
  onClearCart,
  onOrder,
  formatPrice,
  addNotification
}: CartProps) => {
  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CartIconSimple className="w-5 h-5 mr-2" />
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <CartIconSimple className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <CartItem
                key={item.product.id}
                item={item}
                itemTotal={calculateItemTotal(item, cart)}
                onRemove={() => onRemoveItem(item.product.id)}
                onUpdateQuantity={(quantity) => {
                  const result = onUpdateQuantity(item.product.id, quantity);
                  if (!result.success && result.message) {
                    addNotification(result.message, 'error');
                  }
                }}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <CouponSelector
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              onSelect={onApplyCoupon}
              onClear={() => onSetSelectedCoupon(null)}
            />
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">{total.totalBeforeDiscount.toLocaleString()}원</span>
              </div>
              {total.totalBeforeDiscount - total.totalAfterDiscount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>할인 금액</span>
                  <span>-{(total.totalBeforeDiscount - total.totalAfterDiscount).toLocaleString()}원</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">결제 예정 금액</span>
                <span className="font-bold text-lg text-gray-900">{total.totalAfterDiscount.toLocaleString()}원</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={onClearCart} variant="secondary" className="flex-1">
                비우기
              </Button>
              <Button onClick={onOrder} variant="primary" className="flex-1">
                {total.totalAfterDiscount.toLocaleString()}원 결제하기
              </Button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

