import { Dispatch, SetStateAction } from 'react';
import { AddNotification } from '../../hooks/notifications';
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
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  addNotification: AddNotification;
}

const StorePage = ({ products, debouncedSearchTerm, cart, setCart, coupons, selectedCoupon, setSelectedCoupon, addNotification }: StorePageProps) => {
  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };
  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };
  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach(item => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100));
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount)
    };
  };

  const totals = calculateCartTotal();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductSection
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
          addNotification={addNotification}
          cart={cart}
          setCart={setCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <CartSection products={products} cart={cart} setCart={setCart} calculateItemTotal={calculateItemTotal} addNotification={addNotification} />

          {cart.length > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                totals={totals}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                addNotification={addNotification}
              />
              <PaymentSection totals={totals} addNotification={addNotification} setCart={setCart} setSelectedCoupon={setSelectedCoupon} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
