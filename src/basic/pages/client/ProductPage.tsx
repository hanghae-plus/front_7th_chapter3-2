import { type ProductWithUI } from '../../entities/product';
import CartView from './cart-view/CartView';
import ProductSection from './product-section/ProductSection';
import { type CartItem } from '../../entities/cart';
import { type Coupon } from '../../entities/coupon';
interface ProductPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  debouncedSearchTerm: string;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setCart: (cart: CartItem[]) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function ProductPage({
  products,
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
        products={products}
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
        products={products}
        setCart={setCart}
        addNotification={addNotification}
      />
    </div>
  );
}
