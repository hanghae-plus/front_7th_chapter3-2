import { Dispatch, SetStateAction } from 'react';
import { AddNotification } from '../../hooks/notifications';
import { calculateCartTotal } from '../../models/cart';
import { CartItem } from '../../types/carts';
import { Coupon } from '../../types/coupons';
import { ProductWithUI } from '../../types/products';
import CartSection from './components/cart-section';
import CouponSection from './components/coupon-section';
import PaymentSection from './components/payment-section';
import ProductSection from './components/product-section';

interface StorePageProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  totalItemCount: number;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number, products: ProductWithUI[]) => void;
  clearCart: () => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  addNotification: AddNotification;
}

const StorePage = ({
  products,
  debouncedSearchTerm,
  cart,
  totalItemCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  addNotification
}: StorePageProps) => {
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductSection products={products} debouncedSearchTerm={debouncedSearchTerm} cart={cart} addToCart={addToCart} />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <CartSection
            products={products}
            cart={cart}
            totalItemCount={totalItemCount}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />

          {totalItemCount > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                totals={totals}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                addNotification={addNotification}
              />
              <PaymentSection totals={totals} addNotification={addNotification} clearCart={clearCart} setSelectedCoupon={setSelectedCoupon} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
