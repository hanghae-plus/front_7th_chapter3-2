import { useMemo, useState } from 'react';
import { CartItem, Coupon } from '../../../../types';
import { calculateItemTotal, getUpdateCartQuantity } from '../../../entities/cart/utils';
import { ProductWithUI } from '../../../entities/product/types';
import { canApplyCoupon } from '../../../entities/coupon/utils';
import PaymentInfoSection from './PaymentInfoSection';
import CouponSection from './CouponSection';
import CartSection from './CartSection';

interface CartViewProps {
  cart: CartItem[];
  coupons: Coupon[];
  products: ProductWithUI[];
  setCart: (cart: CartItem[]) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function CartView({
  cart,
  coupons,
  products,
  setCart,
  addNotification,
}: CartViewProps) {
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
        <CartSection cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />

        {cart.length > 0 && (
          <CouponSection
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
          />
        )}

        {cart.length > 0 && (
          <PaymentInfoSection
            originTotal={originTotal}
            caculatedTotal={caculatedTotal}
            completeOrder={completeOrder}
          />
        )}
      </div>
    </div>
  );
}
