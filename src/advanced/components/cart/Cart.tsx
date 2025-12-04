import { BagIcon } from "../icons";
import { CouponDiscount } from "../coupon/CouponDiscount";
import { PaymentContainer } from "../payment/PaymentContainer";
import { CartStockItem } from "./CartStockItem";
import { selectedCouponAtom } from "../../stores/atoms/couponAtoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { applyCouponAtom, cartAtom } from "../../stores/atoms/cartAtoms";
import { calculateItemTotal } from "../../models/cart";
import type { Coupon } from "../../../types";

export const Cart = () => {
  const cart = useAtomValue(cartAtom);
  const applyCoupon = useSetAtom(applyCouponAtom);
  const [, setSelectedCoupon] = useAtom(selectedCouponAtom);

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
              const itemTotal = calculateItemTotal(item, cart);
              return <CartStockItem key={item.product.id} item={item} itemTotal={itemTotal} />;
            })}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponDiscount handleApplyCoupon={handleApplyCoupon} />
          <PaymentContainer />
        </>
      )}
    </div>
  );
};
