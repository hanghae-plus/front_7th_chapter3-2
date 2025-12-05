import { useCart } from '../hooks';
import { Cart } from '../features/cart';
import { ProductList } from '../features/product';
import { CouponSelector } from '../features/coupon';
import { OrderSummary } from '../features/order';

interface CartPageProps {
  searchTerm?: string;
}

/**
 * 장바구니 페이지
 *
 * 상품 목록, 장바구니, 쿠폰 선택, 주문 요약을 포함합니다.
 * - 전역 상태를 사용하므로 props 최소화
 * - searchTerm만 UI 상태로 받음
 */
export const CartPage = ({ searchTerm = '' }: CartPageProps) => {
  const { cart } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 상품 목록 */}
      <div className="lg:col-span-3">
        <ProductList searchTerm={searchTerm} />
      </div>

      {/* 장바구니 사이드바 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart />

          {cart.length > 0 && (
            <>
              <CouponSelector />
              <OrderSummary />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
