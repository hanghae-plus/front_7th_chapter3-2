import { useState } from 'react';
import { Provider, createStore, useAtomValue } from 'jotai';
import Header from './widgets/Header/Header';
import AdminPage, { ProductWithUI } from './pages/AdminPage';
import CartPage from './pages/CartPage';
import { Coupon } from './entities/coupon/model';
import { useToast } from './shared/hooks/useToast';
import { ToastContainer } from './shared/ui/Toast/ToastContainer';
import type { CartItem } from './entities/cart/model';
import {
  cartAtom,
  couponsAtom,
  isAdminAtom,
  productsAtom,
  searchTermAtom,
  selectedCouponAtom,
  toastsAtom
} from './shared/store/atoms';
import type { Toast } from './shared/store/atoms';

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
    discounts: [{ quantity: 10, rate: 0.15 }],
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

const STORAGE_KEYS = {
  products: 'products',
  coupons: 'coupons',
  cart: 'cart'
} as const;

const loadPersistedOrDefault = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch (error) {
    console.warn(`[storage] Failed to parse key "${key}"`, error);
    return fallback;
  }
};

const AppContent = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage />}
      </main>
    </div>
  );
};

const App = () => {
  const [store] = useState(() => {
    const jotaiStore = createStore();

    jotaiStore.set(
      productsAtom,
      loadPersistedOrDefault<ProductWithUI[]>(
        STORAGE_KEYS.products,
        initialProducts
      )
    );

    jotaiStore.set(
      couponsAtom,
      loadPersistedOrDefault<Coupon[]>(STORAGE_KEYS.coupons, initialCoupons)
    );

    jotaiStore.set(
      cartAtom,
      loadPersistedOrDefault<CartItem[]>(STORAGE_KEYS.cart, [] as CartItem[])
    );

    jotaiStore.set(toastsAtom, [] as Toast[]);
    jotaiStore.set(selectedCouponAtom, null);
    jotaiStore.set(isAdminAtom, false);
    jotaiStore.set(searchTermAtom, '');

    return jotaiStore;
  });

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;