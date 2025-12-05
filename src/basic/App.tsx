import { useState, useCallback } from 'react';
import {
  Header,
  Logo,
  SearchBar,
  CartBadge,
  ToggleButton,
} from './components/primitives';
import { NotificationContainer } from './components/common/Notification';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { useProducts, ProductWithUI } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useNotifications } from './hooks/useNotifications';
import { formatCurrency, formatCurrencyKRW } from './utils/formatters';
import { getRemainingStock } from './models/cart';
import { isOutOfStock } from './models/product';
import { Coupon } from '../types';
import { useDebounce } from './hooks/useDebounce';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addProduct, addNotification]
  );

  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [updateProduct, addNotification]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [deleteProduct, addNotification]
  );

  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      addCoupon(newCoupon);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addCoupon, addNotification]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [deleteCoupon, addNotification]
  );

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock({ cart, product });
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem && existingItem.quantity + 1 > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      addToCart(product);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addToCart, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, updateQuantity, addNotification]
  );

  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      if (productId) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          const remainingStock = getRemainingStock({ product, cart });
          if (isOutOfStock(remainingStock)) {
            return 'SOLD OUT';
          }
        }
      }

      return isAdmin ? formatCurrencyKRW(price) : formatCurrency(price);
    },
    [products, cart, isAdmin]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      <Header>
        <Header.Left>
          <Logo text="SHOP" />
          {!isAdmin && (
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="상품 검색..."
            />
          )}
        </Header.Left>
        <Header.Right>
          <ToggleButton
            isActive={isAdmin}
            activeText="쇼핑몰로 돌아가기"
            inactiveText="관리자 페이지로"
            onClick={() => setIsAdmin(!isAdmin)}
          />
          {!isAdmin && <CartBadge count={totalItemCount} />}
        </Header.Right>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            formatPrice={formatPrice}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onAddNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            cart={cart}
            coupons={coupons}
            searchTerm={debouncedSearchTerm}
            formatPrice={formatPrice}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onAddNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
