# 심화과제: Pages 리팩토링 - Props Drilling 제거

## 개요

Zustand를 사용한 전역상태관리 적용 후, Pages 컴포넌트에서 Props Drilling을 제거하는 작업을 진행했습니다.

## 작업 목표

- ✅ MainPage, AdminPage에서 불필요한 props 제거
- ✅ Store에서 직접 상태 및 액션 가져오기
- ✅ useProductForm을 Store 기반으로 리팩토링

---

## Before & After

### MainPage.tsx

#### Before (Props Drilling)

```typescript
interface MainPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  coupons: Coupon[];
  onTotalItemCountChange: (count: number) => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const MainPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  coupons,
  onTotalItemCountChange,
  addNotification,
}: MainPageProps) => {
  const { cart, ... } = useCart(products); // products를 props로 받음
  // ...
};
```

**문제점:**
- 6개의 props를 받아야 함
- App.tsx에서 모든 상태를 관리하고 전달해야 함
- `onTotalItemCountChange` 같은 callback props로 인한 복잡도 증가

#### After (Store 사용)

```typescript
export const MainPage = () => {
  // Store에서 직접 가져오기
  const { products } = useProductStore();
  const { coupons } = useCouponStore();
  const { addNotification } = useNotificationStore();
  const {
    cart,
    selectedCoupon,
    getTotals,
    addToCart: addToCartAction,
    removeFromCart,
    updateQuantity: updateQuantityAction,
    applyCoupon: applyCouponAction,
    removeCoupon,
    completeOrder: completeOrderAction,
    getRemainingStock,
  } = useCartStore();

  // 로컬 상태: 검색어만
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

  // totals 계산
  const totals = getTotals();
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거 (0개)
- ✅ Store에서 직접 상태 가져오기
- ✅ 로컬 상태는 검색어만 관리
- ✅ `onTotalItemCountChange` callback 제거 (App에서 store 직접 사용)

---

### AdminPage.tsx

#### Before (Props Drilling)

```typescript
interface AdminPageProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (id: string) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => { success: boolean; message: string };
  deleteCoupon: (code: string) => { success: boolean; message: string };
  addNotification: (message: string, type: "success" | "error") => void;
}

export const AdminPage = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  coupons,
  addCoupon,
  deleteCoupon,
  addNotification,
}: AdminPageProps) => {
  const productForm = useProductForm({
    addProduct,
    updateProduct,
    addNotification,
  });
  // ...
};
```

**문제점:**
- 8개의 props를 받아야 함
- 모든 액션 함수를 props로 전달해야 함
- useProductForm도 props를 받아야 함

#### After (Store 사용)

```typescript
export const AdminPage = () => {
  // Store에서 직접 가져오기
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const { coupons, addCoupon: addCouponAction, deleteCoupon: deleteCouponAction } =
    useCouponStore();
  const { addNotification } = useNotificationStore();

  const productForm = useProductForm(); // props 불필요!

  // 쿠폰 관련 핸들러 (notification 처리 포함)
  const handleAddCoupon = useCallback(
    (newCoupon: typeof coupons[0]) => {
      const result = addCouponAction(newCoupon);
      addNotification(result.message, result.success ? "success" : "error");
    },
    [addCouponAction, addNotification, coupons]
  );
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거 (0개)
- ✅ Store에서 직접 액션 가져오기
- ✅ useProductForm도 props 불필요

---

### useProductForm.ts

#### Before (Props 필요)

```typescript
interface UseProductFormProps {
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  addNotification: (message: string, type: "success" | "error") => void;
}

export const useProductForm = ({
  addProduct,
  updateProduct,
  addNotification,
}: UseProductFormProps) => {
  // ...
};
```

#### After (Store 사용)

```typescript
export const useProductForm = () => {
  // Store에서 직접 가져오기
  const { addProduct, updateProduct } = useProductStore();
  const { addNotification } = useNotificationStore();

  // ...
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (mode === "edit" && editingProductId) {
        updateProduct(editingProductId, formData);
        addNotification("상품이 수정되었습니다.", "success");
      } else {
        addProduct(formData);
        addNotification("상품이 추가되었습니다.", "success");
      }
      resetForm();
    },
    [mode, editingProductId, formData, addProduct, updateProduct, resetForm, addNotification]
  );
  // ...
};
```

**개선점:**
- ✅ Props 완전 제거
- ✅ Store에서 직접 액션 가져오기
- ✅ Notification도 Store에서 처리

---

## 주요 변경 사항

### 1. useProductStore에 initialProducts 추가

```typescript
const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  // ...
];
```

### 2. MainPage 리팩토링

- Props interface 제거
- Store에서 상태 가져오기
- `useCart` → `useCartStore`로 변경
- `filteredProducts` 내부에서 계산
- `totals`는 `getTotals()` 사용

### 3. AdminPage 리팩토링

- Props interface 제거
- Store에서 상태 및 액션 가져오기
- useProductForm props 제거

### 4. useProductForm 리팩토링

- Props interface 제거
- Store에서 직접 액션 가져오기
- Notification도 Store에서 처리

---

## Props 제거 기준

### ✅ 제거한 Props

| Props 유형 | 제거 이유 |
|-----------|----------|
| `products` | `useProductStore()`에서 직접 가져옴 |
| `filteredProducts` | 내부에서 `useMemo`로 계산 |
| `coupons` | `useCouponStore()`에서 직접 가져옴 |
| `addProduct`, `updateProduct`, `deleteProduct` | `useProductStore()`에서 직접 가져옴 |
| `addCoupon`, `deleteCoupon` | `useCouponStore()`에서 직접 가져옴 |
| `addNotification` | `useNotificationStore()`에서 직접 가져옴 |
| `onTotalItemCountChange` | App에서 `useCartStore().getTotalItemCount()` 직접 사용 |

### 🟢 유지할 Props (Features 컴포넌트)

다음 단계에서 Features 컴포넌트도 리팩토링할 예정이지만, 현재는:
- 도메인 엔티티 props는 유지 (예: `item: CartItem`, `product: Product`)
- UI 컴포넌트의 이벤트 핸들러는 유지 (예: `onClick`, `onChange`)

---

## 개선 효과

### 1. Props 개수 감소

- **MainPage**: 6개 → 0개 (100% 감소)
- **AdminPage**: 8개 → 0개 (100% 감소)
- **useProductForm**: 3개 → 0개 (100% 감소)

### 2. 결합도 감소

- Pages 컴포넌트가 App에 의존하지 않음
- Store를 통해 느슨한 결합

### 3. 재사용성 향상

- Pages 컴포넌트를 어디서든 사용 가능 (props 없이)
- 테스트 작성이 쉬워짐

### 4. 코드 가독성 향상

- Props interface가 사라져 코드가 간결해짐
- Store 사용이 명확하게 드러남

---

## 다음 단계

1. ✅ Store 구현 완료
2. ✅ Pages 리팩토링 완료
3. ⏳ Features 컴포넌트 리팩토링 (CartList, ProductList 등)
4. ⏳ App.tsx 간소화
5. ⏳ 테스트 통과 확인

---

## 참고

- Zustand 공식 문서: https://zustand-demo.pmnd.rs/
- Props Drilling 문제: https://kentcdodds.com/blog/prop-drilling
