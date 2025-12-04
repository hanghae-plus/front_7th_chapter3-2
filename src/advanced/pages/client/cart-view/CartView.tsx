import { useMemo } from 'react';
import PaymentInfoSection from './PaymentInfoSection';
import CouponSection from './CouponSection';
import CartSection from './CartSection';
import { calculateItemTotal, getUpdateCartQuantity } from '../../../entities/cart';
import { type Coupon, canApplyCoupon } from '../../../entities/coupon';
import { Dispatch, SetStateAction } from 'react';
import { useProductContext } from '../../../entities/product/contexts/productContext';
import { useCartContext } from '../../../entities/cart/contexts/cartContext';
interface CartViewProps {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function CartView({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: CartViewProps) {
  const { products } = useProductContext();
  const { cart, setCart } = useCartContext();

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
