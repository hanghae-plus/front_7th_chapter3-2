import { ProductWithUI } from '../../entities/product';
import { CartItem, Coupon, Product } from '../../../types';
import { Layout } from '../../widgets/layout.ui';
import { Header } from '../../widgets/header.ui';
import { useMemo, useState } from 'react';
import { useDebounce } from '../../shared/hooks/use-debounce';
import { ToastProps } from '../../shared/ui/toast';
import { ProductSection } from './ui/product-section';
import { CartSection } from './ui/cart-section';
import { CouponSection } from './ui/coupon-section';
import { OrderSection } from './ui/order-section';
import { ConditionalRender } from '../../shared/ui/conditional-render';

interface PropsType {
  products: ProductWithUI[];
  coupons: Coupon[];
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  toast: (notification: ToastProps) => void;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  getRemainingStock: (product: Product) => number;
  clearCart: () => void;
  onToggleAdmin: () => void;
}

export function CartPage({
  products,
  coupons,
  cart,
  selectedCoupon,

  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearCart,
  toast,
  onToggleAdmin,
}: PropsType) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <Layout
      header={
        <Header
          searchTerm={searchTerm}
          totalItemCount={totalItemCount}
          onToggleAdmin={onToggleAdmin}
          onChangeSearchTerm={setSearchTerm}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* 상품 목록 */}
          <ProductSection
            products={products}
            cart={cart}
            searchTerm={debouncedSearchTerm}
            addToCart={addToCart}
            toast={toast}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <CartSection
              cart={cart}
              toast={toast}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />

            <ConditionalRender condition={cart.length > 0}>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                toast={toast}
              />

              <OrderSection
                cart={cart}
                selectedCoupon={selectedCoupon}
                clearCart={clearCart}
                toast={toast}
              />
            </ConditionalRender>
          </div>
        </div>
      </div>
    </Layout>
  );
}
