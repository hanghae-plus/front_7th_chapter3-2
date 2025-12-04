# 심화과제: Features 컴포넌트 리팩토링 - Props Drilling 완전 제거

## 개요

Pages 리팩토링 이후, Features 컴포넌트들에서도 Props Drilling을 완전히 제거하고 Store에서 직접 상태 및 액션을 가져오도록 리팩토링했습니다.

## 작업 목표

- ✅ CartList, ProductList, CheckoutSection에서 props 제거
- ✅ CouponList, ProductTable에서 props 제거
- ✅ ProductForm, CouponForm에서 addNotification props 제거
- ✅ MainPage, AdminPage 간소화

---

## Before & After

### CartList.tsx

#### Before (Props Drilling)

```typescript
interface CartListProps {
  cart: CartItemType[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const CartList = ({
  cart,
  removeFromCart,
  updateQuantity,
}: CartListProps) => {
  // ...
};
```

**문제점:**
- cart, removeFromCart, updateQuantity를 props로 받아야 함
- MainPage에서 모든 상태와 액션을 전달해야 함

#### After (Store 사용)

```typescript
export const CartList = () => {
  // Store에서 직접 가져오기
  const { cart, removeFromCart: removeFromCartAction, updateQuantity: updateQuantityAction } =
    useCartStore();
  const { addNotification } = useNotificationStore();

  // Notification 래퍼 함수들
  const removeFromCart = (productId: string) => {
    removeFromCartAction(productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantityAction(productId, quantity);
    if (result) {
      addNotification(result.message, result.success ? "success" : "error");
    }
  };
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거 (3개 → 0개)
- ✅ Store에서 직접 상태 및 액션 가져오기
- ✅ Notification 처리도 내부에서 처리

---

### ProductList.tsx

#### Before (Props Drilling)

```typescript
interface ProductListProps {
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  addToCart: (product: ProductWithUI) => void;
}

export const ProductList = ({
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  addToCart,
}: ProductListProps) => {
  // ...
};
```

**문제점:**
- 4개의 props를 받아야 함
- filteredProducts는 MainPage에서 계산해서 전달
- 검색어도 MainPage에서 관리

#### After (Store 사용)

```typescript
export const ProductList = () => {
  // Store에서 상태 가져오기
  const { products } = useProductStore();
  const { getRemainingStock, addToCart: addToCartAction } = useCartStore();
  const { addNotification } = useNotificationStore();

  // 로컬 상태: 검색어
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 필터링된 상품 목록 계산
  const filteredProducts = useMemo(
    () =>
      debouncedSearchTerm
        ? products.filter(/* ... */)
        : products,
    [products, debouncedSearchTerm]
  );

  // Notification 래퍼 함수
  const addToCart = (product: ProductWithUI) => {
    const result = addToCartAction(product);
    addNotification(result.message, result.success ? "success" : "error");
  };
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거 (4개 → 0개)
- ✅ 검색어를 내부에서 관리 (로컬 상태)
- ✅ filteredProducts를 내부에서 계산
- ✅ Store에서 직접 상태 및 액션 가져오기

---

### CheckoutSection.tsx

#### Before (Props Drilling)

```typescript
interface CheckoutSectionProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
}

export const CheckoutSection = ({
  coupons,
  selectedCoupon,
  applyCoupon,
  removeCoupon,
  totals,
  completeOrder,
}: CheckoutSectionProps) => {
  // ...
};
```

**문제점:**
- 6개의 props를 받아야 함
- 모든 상태와 액션을 MainPage에서 전달해야 함

#### After (Store 사용)

```typescript
export const CheckoutSection = () => {
  // Store에서 상태 및 액션 가져오기
  const {
    selectedCoupon,
    getTotals,
    applyCoupon: applyCouponAction,
    removeCoupon: removeCouponAction,
    completeOrder: completeOrderAction,
  } = useCartStore();
  const { coupons } = useCouponStore();
  const { addNotification } = useNotificationStore();

  // totals 계산
  const totals = getTotals();

  // Notification 래퍼 함수들
  const applyCoupon = (coupon: typeof coupons[0]) => {
    const result = applyCouponAction(coupon);
    addNotification(result.message, result.success ? "success" : "error");
  };

  const removeCoupon = () => {
    removeCouponAction();
  };

  const completeOrder = () => {
    const result = completeOrderAction();
    addNotification(result.message, result.success ? "success" : "error");
  };
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거 (6개 → 0개)
- ✅ totals는 getTotals()로 계산
- ✅ Notification 처리도 내부에서 처리

---

### CouponList.tsx

#### Before (Props Drilling)

```typescript
interface CouponListProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const CouponList = ({
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  addNotification,
}: CouponListProps) => {
  // ...
};
```

**문제점:**
- 4개의 props를 받아야 함
- AdminPage에서 모든 상태와 액션을 전달해야 함

#### After (Store 사용)

```typescript
export const CouponList = () => {
  // Store에서 상태 및 액션 가져오기
  const { coupons, addCoupon: addCouponAction, deleteCoupon: deleteCouponAction } =
    useCouponStore();
  const { addNotification } = useNotificationStore();

  // Notification 래퍼 함수들
  const handleAddCoupon = (coupon: Coupon) => {
    const result = addCouponAction(coupon);
    addNotification(result.message, result.success ? "success" : "error");
    setShowForm(false);
  };

  const handleDeleteCoupon = (code: string) => {
    const result = deleteCouponAction(code);
    addNotification(result.message, "success");
  };
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거 (4개 → 0개)
- ✅ Store에서 직접 상태 및 액션 가져오기
- ✅ Notification 처리도 내부에서 처리

---

### ProductTable.tsx

#### Before (Props Drilling)

```typescript
interface ProductTableProps {
  products: ProductWithUI[];
  onEdit: (product: ProductWithUI) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onAddNew,
}: ProductTableProps) => {
  // ...
};
```

**문제점:**
- 4개의 props를 받아야 함
- products는 Store에서 가져올 수 있음
- onDelete는 Store에서 가져올 수 있음

#### After (Store 사용)

```typescript
interface ProductTableProps {
  onEdit: (product: ProductWithUI) => void;
  onDelete?: (id: string) => void;
  onAddNew: () => void;
}

export const ProductTable = ({
  onEdit,
  onDelete: onDeleteProp,
  onAddNew,
}: ProductTableProps) => {
  // Store에서 상태 가져오기
  const { products, deleteProduct } = useProductStore();

  // Props가 있으면 사용, 없으면 Store에서 가져온 함수 사용
  const onDelete = onDeleteProp || deleteProduct;
  // ...
};
```

**개선점:**
- ✅ products는 Store에서 직접 가져오기
- ✅ onDelete는 optional로 만들어서, 없으면 Store에서 가져온 함수 사용
- ✅ Props 4개 → 3개 (products 제거)

**참고:** onEdit, onAddNew는 productForm과 연동되어야 하므로 props로 받습니다. 이는 도메인 로직이 아닌 UI 흐름 제어이므로 props로 유지하는 것이 적절합니다.

---

### ProductForm.tsx

#### Before (Context에 addNotification 포함)

```typescript
interface ProductFormContextType {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
  addNotification: (message: string, type: "success" | "error") => void;
}

interface RootProps {
  // ...
  addNotification: (message: string, type: "success" | "error") => void;
}
```

**문제점:**
- addNotification을 Context를 통해 전달해야 함
- Root 컴포넌트에서 props로 받아야 함

#### After (Store 사용)

```typescript
interface ProductFormContextType {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
}

interface RootProps {
  // ...
  // addNotification 제거
}

const Fields = () => {
  const { formData, setFormData } = useProductFormContext();
  const { addNotification } = useNotificationStore(); // Store에서 직접 가져오기
  // ...
};
```

**개선점:**
- ✅ addNotification을 Context에서 제거
- ✅ Store에서 직접 가져오기
- ✅ Root props에서 addNotification 제거

---

### CouponForm.tsx

#### Before (Props Drilling)

```typescript
interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const CouponForm = ({
  onSubmit,
  onCancel,
  addNotification,
}: CouponFormProps) => {
  // ...
};
```

#### After (Store 사용)

```typescript
interface CouponFormProps {
  onSubmit: (coupon: Coupon) => void;
  onCancel: () => void;
}

export const CouponForm = ({ onSubmit, onCancel }: CouponFormProps) => {
  const { addNotification } = useNotificationStore(); // Store에서 직접 가져오기
  // ...
};
```

**개선점:**
- ✅ addNotification props 제거
- ✅ Store에서 직접 가져오기

---

## MainPage & AdminPage 간소화

### MainPage.tsx

#### Before

```typescript
export const MainPage = () => {
  const { products } = useProductStore();
  const { coupons } = useCouponStore();
  const { addNotification } = useNotificationStore();
  const {
    cart,
    selectedCoupon,
    getTotals,
    // ... 많은 상태와 액션
  } = useCartStore();

  // 많은 래퍼 함수들
  const addToCart = useCallback(/* ... */);
  const updateQuantity = useCallback(/* ... */);
  // ...

  return (
    <div>
      <ProductList
        filteredProducts={filteredProducts}
        debouncedSearchTerm={debouncedSearchTerm}
        getRemainingStock={getRemainingStock}
        addToCart={addToCart}
      />
      <CartList
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
      <CheckoutSection
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        applyCoupon={applyCoupon}
        removeCoupon={removeCoupon}
        totals={totals}
        completeOrder={completeOrder}
      />
    </div>
  );
};
```

#### After

```typescript
export const MainPage = () => {
  // cart가 비어있는지 확인하기 위해 가져오기
  const { cart } = useCartStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartList />

          {cart.length > 0 && <CheckoutSection />}
        </div>
      </div>
    </div>
  );
};
```

**개선점:**
- ✅ 모든 props 제거
- ✅ 래퍼 함수들 제거
- ✅ 코드가 매우 간결해짐 (118줄 → 20줄)

---

### AdminPage.tsx

#### Before

```typescript
export const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const { coupons, addCoupon: addCouponAction, deleteCoupon: deleteCouponAction } =
    useCouponStore();
  const { addNotification } = useNotificationStore();

  const productForm = useProductForm();

  const handleAddCoupon = useCallback(/* ... */);
  const handleDeleteCoupon = useCallback(/* ... */);

  return (
    <div>
      <ProductTable
        products={products}
        onEdit={productForm.startEdit}
        onDelete={deleteProduct}
        onAddNew={productForm.openNewForm}
      />
      <CouponList
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        addNotification={addNotification}
      />
    </div>
  );
};
```

#### After

```typescript
export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const productForm = useProductForm();

  return (
    <div className="max-w-6xl mx-auto">
      {/* ... */}
      {activeTab === "products" && (
        <>
          <ProductTable
            onEdit={productForm.startEdit}
            onAddNew={productForm.openNewForm}
          />
          {/* ... */}
        </>
      )}

      {activeTab === "coupons" && <CouponList />}
    </div>
  );
};
```

**개선점:**
- ✅ 대부분의 props 제거
- ✅ 래퍼 함수들 제거
- ✅ 코드가 간결해짐

---

## Props 제거 통계

| 컴포넌트 | Before | After | 감소율 |
|---------|--------|-------|--------|
| **CartList** | 3개 | 0개 | 100% |
| **ProductList** | 4개 | 0개 | 100% |
| **CheckoutSection** | 6개 | 0개 | 100% |
| **CouponList** | 4개 | 0개 | 100% |
| **ProductTable** | 4개 | 3개 | 25% |
| **ProductForm.Root** | 4개 | 3개 | 25% |
| **CouponForm** | 3개 | 2개 | 33% |
| **MainPage** | 0개 | 0개 | - |
| **AdminPage** | 0개 | 0개 | - |

**총 Props 개수: 28개 → 8개 (71% 감소)**

---

## Props 유지 기준

### ✅ 제거한 Props

- 전역상태로 대체 가능한 것 (products, cart, coupons)
- Store에서 가져올 수 있는 액션 (addProduct, deleteProduct 등)
- Notification 함수 (addNotification)

### 🟢 유지한 Props

1. **도메인 엔티티 props** (예: `item: CartItem`, `product: Product`)
   - 컴포넌트가 특정 엔티티를 렌더링하는 경우
   - 재사용성을 위해 유지

2. **UI 흐름 제어 props** (예: `onEdit`, `onAddNew`)
   - productForm과 연동되어야 하는 경우
   - 컴포넌트 간 UI 흐름을 제어하는 경우

3. **이벤트 핸들러 props** (예: `onSubmit`, `onCancel`)
   - UI 컴포넌트의 이벤트 처리
   - 재사용성을 위해 유지

---

## 개선 효과

### 1. 코드 간결성

- **MainPage**: 118줄 → 20줄 (83% 감소)
- **AdminPage**: 88줄 → 51줄 (42% 감소)
- Features 컴포넌트들이 독립적으로 동작

### 2. 결합도 감소

- Features 컴포넌트가 Pages에 의존하지 않음
- Store를 통한 느슨한 결합

### 3. 재사용성 향상

- Features 컴포넌트를 어디서든 사용 가능 (props 없이)
- 테스트 작성이 쉬워짐

### 4. 유지보수성 향상

- 상태 변경 시 한 곳(Store)만 수정하면 됨
- Props 전달 경로를 추적할 필요 없음

---

## 다음 단계

1. ✅ Store 구현 완료
2. ✅ Pages 리팩토링 완료
3. ✅ Features 리팩토링 완료
4. ⏳ App.tsx 간소화
5. ⏳ 테스트 통과 확인

---

## 참고

- Zustand 공식 문서: https://zustand-demo.pmnd.rs/
- Props Drilling 문제: https://kentcdodds.com/blog/prop-drilling
- Compound Components 패턴: https://kentcdodds.com/blog/compound-components-with-react-hooks
