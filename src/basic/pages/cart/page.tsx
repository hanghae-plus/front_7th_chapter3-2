// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시
// - Cart: 장바구니 표시 및 결제

import { ProductWithUI } from '../../entities/product';
import { CartItem, Coupon, Product } from '../../../types';
import { Layout } from '../../widgets/layout.ui';
import { Header } from '../../widgets/header.ui';
import { useMemo, useState } from 'react';
import { useDebounce } from '../../shared/hooks/use-debounce';
import { ToastProps } from '../../shared/ui/toast';
import { ProductSection } from './product-section';
import { CartSection } from './cart-section';
import { CouponSection } from './coupon-section';
import { OrderSection } from './order-section';
import { ConditionalRender } from '../../shared/ui/conditional-render';

interface PropsType {
  products: ProductWithUI[];
  coupons: Coupon[];
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  toast: (notification: ToastProps) => void;
  onAddToCart: (product: ProductWithUI) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onGetRemainingStock: (product: Product) => number;
  onClearCart: () => void;
  onToggleAdmin: () => void;
}

export function CartPage({
  products,
  coupons,
  cart,
  selectedCoupon,

  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onClearCart,
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
            onAddToCart={onAddToCart}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <CartSection
              cart={cart}
              products={products}
              toast={toast}
              onRemoveFromCart={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
            />

            <ConditionalRender condition={cart.length > 0}>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onApplyCoupon={onApplyCoupon}
              />

              <OrderSection
                cart={cart}
                selectedCoupon={selectedCoupon}
                onClearCart={onClearCart}
              />
            </ConditionalRender>
          </div>
        </div>
      </div>
    </Layout>
  );
}
