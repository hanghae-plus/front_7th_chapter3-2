import { Dispatch, SetStateAction } from 'react';
import { calculateCartTotal } from '../../models/cart';
import { cartContext } from '../../stores/cart';
import { Coupon } from '../../types/coupons';
import CartSection from './components/cart-section';
import CouponSection from './components/coupon-section';
import PaymentSection from './components/payment-section';
import ProductSection from './components/product-section';

interface StorePageProps {
  debouncedSearchTerm: string;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

const StorePage = ({ debouncedSearchTerm, coupons, selectedCoupon, setSelectedCoupon }: StorePageProps) => {
  const { cart, totalItemCount } = cartContext();
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductSection debouncedSearchTerm={debouncedSearchTerm} />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <CartSection />

          {totalItemCount > 0 && (
            <>
              <CouponSection coupons={coupons} totals={totals} selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />
              <PaymentSection totals={totals} setSelectedCoupon={setSelectedCoupon} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
