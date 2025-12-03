import { useManageCoupon } from '../admin/hooks/useManageCoupon';

import { useCart } from './hook/useCart';

import { CouponSection } from './components/coupon/CouponSection';
import { PaymentSection } from './components/payment/PaymentSection';
import { CartSection } from './components/cart/CartSection';
import { CartItem, Coupon } from '../../../types';
import { Dispatch, SetStateAction } from 'react';

export const Cart = ({
  cart,
  selectedCoupon,
  setSelectedCoupon,
  cartTotalPrice,
  updateQuantity,
  removeFromCart,
  completeOrder,

  coupons,
  applyCoupon,
}: {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  cartTotalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
  totalItemCount: number;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  completeOrder: () => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  coupons: Coupon[];
  applyCoupon: (
    coupon: Coupon,
    { onSuccess }: { onSuccess?: () => void },
  ) => void;
}) => {
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
