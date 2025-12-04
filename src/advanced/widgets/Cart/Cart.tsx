/**
 * Cart Feature - Cart Component
 * 
 * 장바구니, 쿠폰, 결제 정보 표시 컴포넌트
 */

import { CartItem as CartItemType, Coupon } from '../../../types';
import { CartItem } from './CartItem';
import { CouponList } from '../Coupon/CouponList';
import { CartIcon } from '../../shared/assets/icons/Icons';

interface CartProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  onCompleteOrder: () => void;
  calculateItemTotal: (item: CartItemType) => number;
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

export const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onRemoveCoupon,
  onCompleteOrder,
  calculateItemTotal,
  calculateCartTotal
}: CartProps) => {
  const totals = calculateCartTotal();

  return (
    <div className="sticky top-24 space-y-4">
      {/* 장바구니 */}
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CartIcon className="w-5 h-5 mr-2" />
          장바구니
        </h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <CartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <CartItem
                key={item.product.id}
                item={item}
                onRemove={onRemoveFromCart}
                onUpdateQuantity={onUpdateQuantity}
                calculateItemTotal={calculateItemTotal}
              />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          {/* 쿠폰 선택 */}
          <CouponList
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
          />

          {/* 결제 정보 */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">
                  {totals.totalBeforeDiscount.toLocaleString()}원
                </span>
              </div>
              {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>할인 금액</span>
                  <span>
                    -{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">결제 예정 금액</span>
                <span className="font-bold text-lg text-gray-900">
                  {totals.totalAfterDiscount.toLocaleString()}원
                </span>
              </div>
            </div>
            
            <button
              onClick={onCompleteOrder}
              className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
            >
              {totals.totalAfterDiscount.toLocaleString()}원 결제하기
            </button>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
