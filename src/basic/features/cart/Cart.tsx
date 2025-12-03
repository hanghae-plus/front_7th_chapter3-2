import { CartItem, Coupon } from '../../../types';
import { Dispatch, SetStateAction } from 'react';
import { ProductWithUI } from '../../App';
import { useManageCoupon } from '../admin/hooks/useManageCoupon';

import { useCart } from './hook/useCart';

import { CouponSection } from './components/coupon/CouponSection';
import { PaymentSection } from './components/payment/PaymentSection';
import { CartSection } from './components/cart/CartSection';

export const Cart = ({
  cart,
  setCart,
  addNotification,
  products,
}: {
  products: ProductWithUI[];
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;

  addNotification: (
    message: string,
    type: 'success' | 'error' | 'warning',
  ) => void;
}) => {
  const { coupons, selectedCoupon, setSelectedCoupon, applyCoupon } =
    useManageCoupon();

  const { updateQuantity, removeFromCart, cartTotalPrice, completeOrder } =
    useCart({
      products,
      cart,
      setCart,
      addNotification,
      selectedCoupon,
      setSelectedCoupon,
      applyCoupon: (coupon: Coupon) => {
        applyCoupon(coupon, {
          onSuccess: () => {
            addNotification('쿠폰이 적용되었습니다.', 'success');
          },
        });
      },
    });

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartSection
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />

        {cart.length > 0 && (
          <>
            <CouponSection
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              coupons={coupons}
              cartTotalPrice={cartTotalPrice}
              applyCoupon={applyCoupon}
              addNotification={addNotification}
            />

            <PaymentSection
              cartTotalPrice={cartTotalPrice}
              completeOrder={completeOrder}
            />
          </>
        )}
      </div>
    </div>
  );
};
