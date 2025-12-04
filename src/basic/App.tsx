import { useState, useMemo } from 'react';
import Header from './widgets/Header/Header';
import AdminPage, { ProductWithUI } from './pages/AdminPage';
import CartPage from './pages/CartPage';
import { Coupon } from './entities/coupon/model';
import { filterProducts } from './entities/product/utils';
import { formatPrice as formatPriceUtil } from './shared/utils/format';
import { useDebounce } from './shared/hooks/useDebounce';
import { useToast } from './shared/hooks/useToast';
import { useCart } from './hooks/useCart';
import { useProduct } from './hooks/useProduct';
import { useCoupon } from './hooks/useCoupon';
import { ToastContainer } from './shared/ui/Toast/ToastContainer';

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ],
    description: '최고급 품질의 프리미엄 상품입니다.'
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.15 }
    ],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 }
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.'
  }
];

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const App = () => {
  // UI 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Toast Hook
  const { toasts, addToast, removeToast } = useToast();

  // Product Hook
  const productHook = useProduct({
    initialProducts,
    onNotify: addToast
  });

  // Coupon Hook
  const couponHook = useCoupon({
    initialCoupons,
    onNotify: addToast
  });

  // Cart Hook
  const cartHook = useCart({
    products: productHook.products,
    onNotify: addToast
  });

  // 검색된 상품 필터링
  const filteredProducts = useMemo(() => 
    filterProducts(productHook.products, debouncedSearchTerm),
    [productHook.products, debouncedSearchTerm]
  );

  // 가격 포맷팅 (관리자 모드에 따라)
  const formatPrice = (price: number, productId?: string): string => {
    return formatPriceUtil(
      price,
      isAdmin,
      productId ? productHook.products.find(p => p.id === productId) : undefined,
      cartHook.cart
    );
  };

  // calculateCartTotal 함수 (CartPage props 호환)
  const calculateCartTotal = () => cartHook.totals;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
      />
      <Header
        cart={cartHook.cart}
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin(prev => !prev)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={productHook.products}
            coupons={couponHook.coupons}
            onAddProduct={productHook.addProduct}
            onUpdateProduct={productHook.updateProduct}
            onDeleteProduct={productHook.deleteProduct}
            onAddCoupon={couponHook.addCoupon}
            onDeleteCoupon={couponHook.deleteCoupon}
            formatPrice={formatPrice}
            onNotify={addToast}
          />
        ) : (
          <CartPage
            products={filteredProducts}
            cart={cartHook.cart}
            coupons={couponHook.coupons}
            selectedCoupon={cartHook.selectedCoupon}
            searchTerm={debouncedSearchTerm}
            onAddToCart={cartHook.addToCart}
            onRemoveFromCart={cartHook.removeFromCart}
            onUpdateQuantity={cartHook.updateQuantity}
            onApplyCoupon={cartHook.applyCoupon}
            onRemoveCoupon={cartHook.removeCoupon}
            onCompleteOrder={cartHook.completeOrder}
            formatPrice={formatPrice}
            getRemainingStock={cartHook.getRemainingStock}
            calculateItemTotal={cartHook.calculateItemTotal}
            calculateCartTotal={calculateCartTotal}
          />
        )}
      </main>
    </div>
  );
};

export default App;