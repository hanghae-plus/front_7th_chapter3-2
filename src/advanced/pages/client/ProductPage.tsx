import { type ProductWithUI } from '../../entities/product';
import CartView from './cart-view/CartView';
import ProductSection from './product-section/ProductSection';
import { type CartItem } from '../../entities/cart';
import { type Coupon } from '../../entities/coupon';
import { Dispatch, SetStateAction } from 'react';
interface ProductPageProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  debouncedSearchTerm: string;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function ProductPage({
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  debouncedSearchTerm,
  addNotification,
  setCart,
}: ProductPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductSection
        debouncedSearchTerm={debouncedSearchTerm}
        cart={cart}
        setCart={setCart}
        addNotification={addNotification}
      />
      <CartView
        cart={cart}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        setCart={setCart}
        addNotification={addNotification}
      />
    </div>
  );
}
