import { CartItem, Coupon } from '../../../types';
import { ProductWithUI } from '../../entities/product/types';
import CartView from './cart-view/CartView';
import ProductSection from './product-section/ProductSection';
interface ProductPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  debouncedSearchTerm: string;

  setCart: (cart: CartItem[]) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function ProductPage({
  products,
  cart,
  coupons,
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
        products={products}
        setCart={setCart}
        addNotification={addNotification}
      />
    </div>
  );
}
