import { BagIcon } from "../icons";
import { CouponDiscount } from "../coupon/CouponDiscount";
import { PaymentContainer } from "../payment/PaymentContainer";
import { CartStockItem } from "./CartStockItem";
import type { CartItem, Coupon } from "../../../types";

interface CartProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  calcItemTotal: (item: CartItem) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
}

export const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  calcItemTotal,
  removeFromCart,
  updateQuantity,
  totals,
  completeOrder,
}: CartProps) => {
  const handleApplyCoupon = (e: React.ChangeEvent<HTMLSelectElement>, coupons: Coupon[]) => {
    const coupon = coupons.find((c) => c.code === e.target.value);
    if (coupon) applyCoupon(coupon);
    else setSelectedCoupon(null);
  };

  return (
    <div className='sticky top-24 space-y-4'>
      <section className='bg-white rounded-lg border border-gray-200 p-4'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <BagIcon className='w-5 h-5 mr-2' />
          장바구니
        </h2>
        {cart.length === 0 ? (
          <div className='text-center py-8'>
            <BagIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' strokeWidth={1} />
            <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {cart.map((item) => {
              const itemTotal = calcItemTotal(item);
              return (
                <CartStockItem
                  key={item.product.id}
                  item={item}
                  itemTotal={itemTotal}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              );
            })}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponDiscount
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            handleApplyCoupon={handleApplyCoupon}
          />
          <PaymentContainer totals={totals} completeOrder={completeOrder} />
        </>
      )}
    </div>
  );
};
