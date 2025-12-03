import { useState, useCallback, useMemo } from 'react';
import { Coupon } from '../types';
import { Header } from './components/ui/Header';
import { NotificationContainer } from './components/ui/Notification';
import { ShoppingMallPage } from './pages/ShoppingMallPage';
import { AdminPage } from './pages/AdminPage';
import { useProducts, ProductWithUI } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useNotifications } from './hooks/useNotifications';
import { useDebounce } from './hooks/useDebounce';
import { calculateCartTotal } from './models/cart';
import { formatCurrency, formatCurrencyKRW } from './utils/formatters';
import { getRemainingStock } from './models/cart';
import { isOutOfStock } from './models/product';

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

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      // 상품이 있으면 재고 확인
      if (productId) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          const remainingStock = getRemainingStock({ product, cart });
          if (isOutOfStock(remainingStock)) {
            return 'SOLD OUT';
          }
        }
      }

      // 관리자 여부에 따라 포맷 선택
      return isAdmin ? formatCurrencyKRW(price) : formatCurrency(price);
    },
    [products, cart, isAdmin]
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

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal({
        cart,
        selectedCoupon: null,
      }).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error'
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [cart, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart]);

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
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, deleteCoupon, addNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      handleUpdateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const totals = useMemo(
    () => calculateCartTotal({ cart, selectedCoupon }),
    [cart, selectedCoupon]
  );

  const filteredProducts = useMemo(() => {
    return debouncedSearchTerm
      ? products.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            (product.description &&
              product.description
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()))
        )
      : products;
  }, [products, debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      <Header
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            activeTab={activeTab}
            showProductForm={showProductForm}
            showCouponForm={showCouponForm}
            editingProduct={editingProduct}
            productForm={productForm}
            couponForm={couponForm}
            formatPrice={formatPrice}
            onSetActiveTab={setActiveTab}
            onEditProduct={startEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddProductClick={() => {
              setEditingProduct('new');
              setProductForm({
                name: '',
                price: 0,
                stock: 0,
                description: '',
                discounts: [],
              });
              setShowProductForm(true);
            }}
            onProductFormChange={setProductForm}
            onProductSubmit={handleProductSubmit}
            onProductFormCancel={() => {
              setEditingProduct(null);
              setProductForm({
                name: '',
                price: 0,
                stock: 0,
                description: '',
                discounts: [],
              });
              setShowProductForm(false);
            }}
            onDeleteCoupon={handleDeleteCoupon}
            onToggleCouponForm={() => setShowCouponForm(!showCouponForm)}
            onCouponFormChange={setCouponForm}
            onCouponSubmit={handleCouponSubmit}
            onCouponFormCancel={() => setShowCouponForm(false)}
            onAddNotification={addNotification}
          />
        ) : (
          <ShoppingMallPage
            products={filteredProducts}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            searchTerm={debouncedSearchTerm}
            totals={totals}
            formatPrice={formatPrice}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={removeFromCart}
            onSelectCoupon={(coupon) => {
              if (coupon) {
                applyCoupon(coupon);
              } else {
                setSelectedCoupon(null);
              }
            }}
            onCompleteOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
