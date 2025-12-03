import { useState, useCallback, useEffect } from 'react';
import { Notification } from '../types';
import Header from './widgets/Header/Header';
import AdminPage, { ProductWithUI } from './pages/AdminPage';
import CartPage from './pages/CartPage';
import NotificationList from './widgets/NotificationList/NotificationList';
import { CartItem } from './entities/cart/model';
import { Coupon } from './entities/coupon/model';
import { Product } from './entities/product/model';
import { 
  calculateCartTotal as calcCartTotal,
  calculateItemTotal as calcItemTotal
} from './entities/cart/utils';
import { getRemainingStock as getStock, filterProducts } from './entities/product/utils';
import { canApplyCoupon, isDuplicateCoupon } from './entities/coupon/utils';
import { formatPrice as formatPriceUtil, generateOrderNumber } from './shared/utils/format';

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

  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


  const formatPrice = (price: number, productId?: string): string => {
    return formatPriceUtil(
      price, 
      isAdmin, 
      productId ? products.find(p => p.id === productId) : undefined,
      cart
    );
  };

  const getRemainingStock = (product: Product): number => {
    return getStock(product, cart);
  };

  const calculateItemTotal = (item: CartItem): number => {
    return calcItemTotal(item, cart);
  };

  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    return calcCartTotal(cart, selectedCoupon);
  };

  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addToCart = useCallback((product: ProductWithUI) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return prevCart;
        }
      }
      
      // 재고 검증 통과
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
    
    addNotification('장바구니에 담았습니다', 'success');
  }, [cart, addNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [products, removeFromCart, addNotification]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calculateCartTotal().totalAfterDiscount;
    
    const { canApply: isValid, reason } = canApplyCoupon(coupon, currentTotal);
    if (!isValid && reason) {
      addNotification(reason, 'error');
      return;
    }

    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  }, [addNotification, cart, selectedCoupon]);

  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
    addNotification('상품이 추가되었습니다.', 'success');
  }, [addNotification]);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    addNotification('상품이 수정되었습니다.', 'success');
  }, [addNotification]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addNotification('상품이 삭제되었습니다.', 'success');
  }, [addNotification]);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    if (isDuplicateCoupon(coupons, newCoupon.code)) {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons(prev => [...prev, newCoupon]);
    addNotification('쿠폰이 추가되었습니다.', 'success');
  }, [coupons, addNotification]);

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  }, [selectedCoupon, addNotification]);

  const filteredProducts = filterProducts(products, debouncedSearchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList 
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
      <Header
        cart={cart}
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin(prev => !prev)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddCoupon={addCoupon}
            onDeleteCoupon={deleteCoupon}
            formatPrice={formatPrice}
            onNotify={addNotification}
          />
        ) : (
          <CartPage
            products={filteredProducts}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            searchTerm={debouncedSearchTerm}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={() => setSelectedCoupon(null)}
            onCompleteOrder={completeOrder}
            formatPrice={formatPrice}
            getRemainingStock={getRemainingStock}
            calculateItemTotal={calculateItemTotal}
            calculateCartTotal={calculateCartTotal}
          />
        )}
      </main>
    </div>
  );
};

export default App;