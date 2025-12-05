import type { CartItem, Coupon } from '../../types';
import type { ProductWithUI } from '../hooks';
import type { CartTotal } from '../models';
import { Cart } from '../features/cart';
import { ProductList } from '../features/product';
import { CouponSelector } from '../features/coupon';
import { OrderSummary } from '../features/order';

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: CartTotal;
  getRemainingStock: (product: ProductWithUI) => number;
  displayPrice: (price: number, productId?: string) => string;
  getMaxDiscountPercent: (discounts: Array<{ quantity: number; rate: number }>) => number;
  getItemTotal: (item: CartItem) => number;
  getDiscountRate: (item: CartItem) => number;
  onAddToCart: (product: ProductWithUI) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
}

/**
 * 장바구니 페이지
 *
 * 상품 목록, 장바구니, 쿠폰 선택, 주문 요약을 포함합니다.
 */
export const CartPage = ({
  products,
  filteredProducts,
  searchTerm,
  cart,
  coupons,
  selectedCoupon,
  totals,
  getRemainingStock,
  displayPrice,
  getMaxDiscountPercent,
  getItemTotal,
  getDiscountRate,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  onCompleteOrder
}: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 상품 목록 */}
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          totalCount={products.length}
          searchTerm={searchTerm}
          getRemainingStock={getRemainingStock}
          displayPrice={displayPrice}
          getMaxDiscountPercent={getMaxDiscountPercent}
          onAddToCart={onAddToCart}
        />
      </div>

      {/* 장바구니 사이드바 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            getItemTotal={getItemTotal}
            getDiscountRate={getDiscountRate}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveFromCart}
          />

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onApply={onApplyCoupon}
              />

              <OrderSummary
                totals={totals}
                onCompleteOrder={onCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
