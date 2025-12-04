import { useMemo, useState } from 'react';
import { CartItem, Coupon } from '../../../../types';
import { calculateItemTotal, getUpdateCartQuantity } from '../../../entities/cart';
import CartListItem from './CartListItem';
import { formatPriceKRW } from '../../../utils';
import { canApplyCoupon } from '../../../entities/Coupon';
import { ProductWithUI } from '../../../types';

interface CartSectionProps {
  cart: CartItem[];
  coupons: Coupon[];
  products: ProductWithUI[];
  setCart: (cart: CartItem[]) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function CartSection({
  cart,
  coupons,
  products,
  setCart,
  addNotification,
}: CartSectionProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Computed Values
  const originTotal = useMemo(() => {
    const total = cart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
    return Math.round(total);
  }, [cart]);

  const caculatedTotal = useMemo(() => {
    const total = cart.reduce((total, item) => {
      return total + calculateItemTotal(item, cart);
    }, 0);

    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        return Math.max(0, total - selectedCoupon.discountValue);
      } else {
        return Math.round(total * (1 - selectedCoupon.discountValue / 100));
      }
    }

    return Math.round(total);
  }, [cart, selectedCoupon]);

  // Events
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    setCart(prevCart => getUpdateCartQuantity(prevCart, productId, newQuantity));
  };

  const applyCoupon = (coupon: Coupon) => {
    if (!canApplyCoupon(caculatedTotal, coupon)) {
      addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  };

  const completeOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => {
                const itemTotal = calculateItemTotal(item, cart);
                const originalPrice = item.product.price * item.quantity;
                const discountRate =
                  itemTotal < originalPrice ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

                return (
                  <CartListItem
                    key={`cart-list-item-${item.product.id}`}
                    item={item}
                    itemTotal={itemTotal}
                    discountRate={discountRate}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
              <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
            </div>
            <select
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={selectedCoupon?.code || ''}
              onChange={e => {
                const coupon = coupons.find(c => c.code === e.target.value);
                if (coupon) applyCoupon(coupon);
                else setSelectedCoupon(null);
              }}
            >
              <option value="">쿠폰 선택</option>
              {coupons.map(coupon => (
                <option key={coupon.code} value={coupon.code}>
                  {coupon.name} (
                  {coupon.discountType === 'amount'
                    ? `${formatPriceKRW(coupon.discountValue, 'suffix')}`
                    : `${coupon.discountValue}%`}
                  )
                </option>
              ))}
            </select>
          </section>
        )}

        {cart.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">{formatPriceKRW(originTotal, 'suffix')}</span>
              </div>
              {originTotal - caculatedTotal > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>할인 금액</span>
                  <span>-{formatPriceKRW(originTotal - caculatedTotal, 'suffix')}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">결제 예정 금액</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPriceKRW(caculatedTotal, 'suffix')}
                </span>
              </div>
            </div>

            <button
              onClick={completeOrder}
              className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
            >
              {formatPriceKRW(caculatedTotal, 'suffix')} 결제하기
            </button>

            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
