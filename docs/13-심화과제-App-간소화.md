# 심화과제: App.tsx 간소화 - 거대 단일 컴포넌트 리팩토링

## 개요

Pages와 Features 리팩토링 이후, App.tsx를 1125줄의 거대한 단일 컴포넌트에서 Store 기반의 간결한 구조로 리팩토링했습니다.

## 작업 목표

- ✅ App.tsx 1125줄 → 40줄로 간소화
- ✅ 모든 상태를 Store로 이동
- ✅ ToastContainer, CartIcon Store 연동
- ✅ 불필요한 props 완전 제거

---

## Before & After

### App.tsx

#### Before (1125줄의 거대 단일 컴포넌트)

```typescript
const App = () => {
  // 수많은 useState
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    // ...
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    // ...
  });
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    // ...
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // ... 더 많은 상태들

  // 수많은 함수들
  const formatPrice = (price: number, productId?: string): string => {
    // ...
  };
  const getMaxApplicableDiscount = (item: CartItem): number => {
    // ...
  };
  const calculateItemTotal = (item: CartItem): number => {
    // ...
  };
  const calculateCartTotal = (): { ... } => {
    // ...
  };
  // ... 더 많은 함수들

  // 수많은 useEffect
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  // ... 더 많은 useEffect들

  // 거대한 JSX (1000줄 이상)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모든 UI가 여기에 직접 작성됨 */}
    </div>
  );
};
```

**문제점:**
- 1125줄의 거대한 단일 컴포넌트
- 모든 상태를 useState로 관리
- 모든 비즈니스 로직이 컴포넌트 내부에 있음
- localStorage 직접 관리
- JSX에 모든 UI가 직접 작성됨
- 테스트 불가능
- 재사용 불가능

#### After (40줄의 간결한 구조)

```typescript
import { useState } from "react";
import { Header } from "./components/Header";
import { ToastContainer } from "./components/ToastContainer";
import { CartIcon } from "./features";
import { MainPage } from "./pages/MainPage";
import { AdminPage } from "./pages/AdminPage";
import { useCartStore } from "./store/useCartStore";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { getTotalItemCount } = useCartStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <Header.Root>
        <Header.Left>
          <Header.Logo />
        </Header.Left>
        <Header.Right>
          <Header.AdminToggle
            isAdmin={isAdmin}
            onToggle={() => setIsAdmin(!isAdmin)}
          />
          {!isAdmin && <CartIcon itemCount={getTotalItemCount()} />}
        </Header.Right>
      </Header.Root>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <MainPage />}
      </main>
    </div>
  );
};

export default App;
```

**개선점:**
- ✅ 1125줄 → 40줄 (96% 감소)
- ✅ 모든 상태를 Store로 이동
- ✅ 비즈니스 로직을 Store와 models로 분리
- ✅ 컴포넌트 계층 구조 명확화
- ✅ 테스트 가능한 구조
- ✅ 재사용 가능한 컴포넌트

---

## 주요 변경 사항

### 1. 상태 관리

#### Before
```typescript
// App.tsx 내부에서 모든 상태 관리
const [products, setProducts] = useState<ProductWithUI[]>(() => {
  const saved = localStorage.getItem('products');
  // ...
});
const [cart, setCart] = useState<CartItem[]>(() => {
  // ...
});
const [coupons, setCoupons] = useState<Coupon[]>(() => {
  // ...
});
const [notifications, setNotifications] = useState<Notification[]>([]);
// ...
```

#### After
```typescript
// Store에서 상태 가져오기
const { getTotalItemCount } = useCartStore();
// products, cart, coupons, notifications는 각 Store에서 관리
```

**개선점:**
- ✅ 상태가 Store로 이동
- ✅ localStorage는 Zustand persist middleware로 자동 처리
- ✅ App.tsx는 isAdmin만 로컬 상태로 관리

---

### 2. 비즈니스 로직

#### Before
```typescript
// App.tsx 내부에 모든 비즈니스 로직
const formatPrice = (price: number, productId?: string): string => {
  // ...
};
const getMaxApplicableDiscount = (item: CartItem): number => {
  // ...
};
const calculateItemTotal = (item: CartItem): number => {
  // ...
};
const calculateCartTotal = (): { ... } => {
  // ...
};
// ... 더 많은 함수들
```

#### After
```typescript
// 비즈니스 로직은 models/cart.ts에 순수 함수로 분리
// Store에서 액션으로 제공
// App.tsx에는 비즈니스 로직 없음
```

**개선점:**
- ✅ 비즈니스 로직을 models로 분리
- ✅ 순수 함수로 작성하여 테스트 가능
- ✅ Store에서 액션으로 제공

---

### 3. 컴포넌트 구조

#### Before
```typescript
// 모든 UI가 App.tsx에 직접 작성
return (
  <div className="min-h-screen bg-gray-50">
    {/* 1000줄 이상의 JSX */}
    {notifications.length > 0 && (
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {/* ... */}
      </div>
    )}
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      {/* ... */}
    </header>
    <main className="max-w-7xl mx-auto px-4 py-8">
      {isAdmin ? (
        <div className="max-w-6xl mx-auto">
          {/* 관리자 페이지 전체 UI */}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 메인 페이지 전체 UI */}
        </div>
      )}
    </main>
  </div>
);
```

#### After
```typescript
// 컴포넌트 계층 구조로 분리
return (
  <div className="min-h-screen bg-gray-50">
    <ToastContainer />
    <Header.Root>
      <Header.Left>
        <Header.Logo />
      </Header.Left>
      <Header.Right>
        <Header.AdminToggle
          isAdmin={isAdmin}
          onToggle={() => setIsAdmin(!isAdmin)}
        />
        {!isAdmin && <CartIcon itemCount={getTotalItemCount()} />}
      </Header.Right>
    </Header.Root>
    <main className="max-w-7xl mx-auto px-4 py-8">
      {isAdmin ? <AdminPage /> : <MainPage />}
    </main>
  </div>
);
```

**개선점:**
- ✅ 컴포넌트 계층 구조 명확화
- ✅ 재사용 가능한 컴포넌트로 분리
- ✅ 각 컴포넌트가 단일 책임을 가짐

---

### 4. ToastContainer 리팩토링

#### Before
```typescript
interface ToastContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({
  notifications,
  onRemove,
}: ToastContainerProps) => {
  // ...
};
```

#### After
```typescript
export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();
  // ...
};
```

**개선점:**
- ✅ Props 제거 (2개 → 0개)
- ✅ Store에서 직접 상태 가져오기

---

### 5. CartIcon 리팩토링

#### Before
```typescript
interface CartIconProps {
  itemCount: number;
  show: boolean;
}

export const CartIcon = ({ itemCount, show }: CartIconProps) => {
  if (!show) return null;
  // ...
};
```

#### After
```typescript
export const CartIcon = ({ itemCount }: { itemCount: number }) => {
  // show prop 제거, 조건부 렌더링으로 처리
  // ...
};
```

**개선점:**
- ✅ show prop 제거 (조건부 렌더링으로 처리)
- ✅ Props 2개 → 1개

---

## 코드 통계

### 줄 수 비교

| 파일 | Before | After | 감소율 |
|------|--------|-------|--------|
| **App.tsx** | 1125줄 | 40줄 | **96% 감소** |

### Props 개수 비교

| 컴포넌트 | Before | After | 감소율 |
|---------|--------|-------|--------|
| **ToastContainer** | 2개 | 0개 | 100% |
| **CartIcon** | 2개 | 1개 | 50% |
| **App** | - | - | - |

---

## 개선 효과

### 1. 가독성 향상

- **Before**: 1125줄의 거대한 파일, 모든 것이 한 곳에
- **After**: 40줄의 간결한 파일, 구조가 명확함

### 2. 유지보수성 향상

- **Before**: 상태 변경 시 App.tsx만 수정
- **After**: 각 Store와 컴포넌트가 독립적으로 관리

### 3. 테스트 가능성

- **Before**: 거대한 컴포넌트로 인해 테스트 불가능
- **After**: 각 컴포넌트와 Store를 독립적으로 테스트 가능

### 4. 재사용성 향상

- **Before**: 모든 것이 App.tsx에 있어 재사용 불가능
- **After**: 각 컴포넌트가 독립적으로 재사용 가능

### 5. 성능 최적화

- **Before**: 모든 상태 변경 시 전체 컴포넌트 리렌더링
- **After**: Store 기반으로 필요한 부분만 리렌더링

---

## 리팩토링 단계별 요약

### Step 1: Store 구현
- ✅ useProductStore
- ✅ useCartStore
- ✅ useCouponStore
- ✅ useNotificationStore

### Step 2: Pages 리팩토링
- ✅ MainPage: Props 6개 → 0개
- ✅ AdminPage: Props 8개 → 0개

### Step 3: Features 리팩토링
- ✅ CartList, ProductList, CheckoutSection: Props 완전 제거
- ✅ CouponList, ProductTable: Props 대부분 제거
- ✅ ProductForm, CouponForm: addNotification props 제거

### Step 4: App.tsx 간소화
- ✅ 1125줄 → 40줄 (96% 감소)
- ✅ 모든 상태를 Store로 이동
- ✅ ToastContainer, CartIcon Store 연동

---

## 최종 구조

```
App.tsx (40줄)
├── ToastContainer (Store에서 notifications 가져오기)
├── Header
│   ├── Logo
│   ├── AdminToggle
│   └── CartIcon (Store에서 itemCount 가져오기)
└── main
    ├── AdminPage (Store에서 모든 상태 가져오기)
    └── MainPage (Store에서 모든 상태 가져오기)
```

---

## 다음 단계

1. ✅ Store 구현 완료
2. ✅ Pages 리팩토링 완료
3. ✅ Features 리팩토링 완료
4. ✅ App.tsx 간소화 완료
5. ⏳ 테스트 통과 확인

---

## 참고

- Zustand 공식 문서: https://zustand-demo.pmnd.rs/
- Single Responsibility Principle: https://en.wikipedia.org/wiki/Single-responsibility_principle
- Component Composition: https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context
