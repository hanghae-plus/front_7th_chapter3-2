import useSelectedCoupon from '../../hooks/selected-coupon';
import { calculateCartTotal } from '../../models/cart';
import { cartContext } from '../../stores/cart';
import CartSection from './components/cart-section';
import CouponSection from './components/coupon-section';
import PaymentSection from './components/payment-section';
import ProductSection from './components/product-section';

const StorePage = () => {
  const { cart, totalItemCount } = cartContext();
  const [selectedCoupon, setSelectedCoupon] = useSelectedCoupon();
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductSection />
      </div>
      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <CartSection />
          {totalItemCount > 0 && (
            <>
              <CouponSection totals={totals} selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />
              <PaymentSection totals={totals} setSelectedCoupon={setSelectedCoupon} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
