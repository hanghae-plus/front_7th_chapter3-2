/**
 * CartPage Component
 * 
 * 책임: 쇼핑 페이지 UI 조합
 * - ProductList와 Cart 컴포넌트 조합
 * - Props 전달만 담당
 */

import { CartItem, Coupon } from '../../types';
import { ProductWithUI } from './AdminPage';
import { ProductList } from '../widgets/Product/ProductList';
import { Cart } from '../widgets/Cart/Cart';

interface CartPageProps {
  // 데이터
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  searchTerm: string;
  
  // 장바구니 액션
  onAddToCart: (product: ProductWithUI) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  
  // 쿠폰 액션
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  
  // 주문 액션
  onCompleteOrder: () => void;
  
  // 유틸 함수
  formatPrice: (price: number, productId?: string) => string;
  getRemainingStock: (product: ProductWithUI) => number;
  calculateItemTotal: (item: CartItem) => number;
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

const CartPage = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  searchTerm,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onRemoveCoupon,
  onCompleteOrder,
  formatPrice,
  getRemainingStock,
  calculateItemTotal,
  calculateCartTotal,
}: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 상품 목록 */}
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          searchTerm={searchTerm}
          onAddToCart={onAddToCart}
          formatPrice={formatPrice}
          getRemainingStock={getRemainingStock}
        />
      </div>
      
      {/* 장바구니 & 결제 */}
      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateQuantity={onUpdateQuantity}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          onCompleteOrder={onCompleteOrder}
          calculateItemTotal={calculateItemTotal}
          calculateCartTotal={calculateCartTotal}
        />
      </div>
    </div>
  );
};

export default CartPage;
