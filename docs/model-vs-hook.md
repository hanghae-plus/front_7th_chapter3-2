# Model vs Hook 완벽 가이드

> **핵심 질문**: `models/cart.ts`와 `hooks/useCart.ts`의 차이가 뭘까?

---

## 🎯 핵심 개념

### Model = 순수 비즈니스 로직

### Hook = React 상태 관리 + 부수 효과

---

## 📊 역할 분리 다이어그램

```
┌─────────────────────────────────────────┐
│         Component (UI Layer)            │
│  - useCart() 호출                       │
│  - 렌더링만 담당                         │
│  - 사용자 인터랙션 처리                  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│    Hook (State + Side Effects)          │
│  ✅ useState (React 상태)                │
│  ✅ useEffect (동기화)                   │
│  ✅ localStorage 읽기/쓰기               │
│  ✅ alert, 이벤트 발생                   │
│  ✅ Model 함수 호출 ← 핵심!              │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      Model (Pure Business Logic)        │
│  ✅ 순수 함수만                          │
│  ✅ React 무관                           │
│  ✅ 부수 효과 없음                       │
│  ✅ 같은 입력 → 같은 출력                │
│  ✅ 테스트 용이                          │
└─────────────────────────────────────────┘
```

---

## 📦 Model (models/cart.ts)

### 역할

- **순수 비즈니스 로직**만 담당
- React와 완전히 독립적
- 어디서든 재사용 가능 (React, Vue, Node.js 등)

### 특징

```typescript
// ✅ 순수 함수 예시
export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  // 1. 모든 데이터를 파라미터로 받음
  // 2. 외부 상태에 의존하지 않음
  // 3. 부수 효과 없음 (localStorage, API 호출 등 X)
  // 4. 새로운 값을 반환 (원본 변경 X)

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};
```

### 포함되는 함수들

```typescript
// 계산 함수
calculateItemTotal(cart, item);
calculateCartTotal(cart, coupon);
calculateDiscountAmount(totalBefore, totalAfter);

// 상태 판단 함수
getCartItemDiscount(cart, item);
getRemainingStock(cart, product);

// 데이터 변환 함수
addItemToCart(cart, product);
removeItemFromCart(cart, productId);
updateCartItemQuantity(cart, productId, quantity);
```

### ✅ Model에 들어가야 하는 것

- ✅ 계산 로직
- ✅ 데이터 변환
- ✅ 비즈니스 규칙
- ✅ 유효성 검증 로직

### ❌ Model에 들어가면 안 되는 것

- ❌ localStorage 접근
- ❌ API 호출
- ❌ useState, useEffect
- ❌ alert, console.log
- ❌ 이벤트 발생
- ❌ DOM 조작

---

## 🎣 Hook (hooks/useCart.ts)

### 역할

- **React 상태 관리**
- **부수 효과 처리** (localStorage, API 등)
- **Model 함수 활용**

### 특징

```typescript
// ✅ Hook 예시
export const useCart = () => {
  // 1. React 상태 관리
  const [cart, setCart] = useState<CartItem[]>(() => {
    // 부수 효과: localStorage 읽기
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 부수 효과: localStorage 동기화
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cart]);

  // 3. Model 함수 활용
  const addToCart = (product: ProductWithUI) => {
    setCart((prev) => {
      // Model의 순수 함수 호출
      const newCart = addItemToCart(prev, product);

      // Hook에서만 가능한 UI 피드백
      if (newCart === prev) {
        alert(`재고는 ${product.stock}개까지만 있습니다.`);
      }

      return newCart;
    });
  };

  return { cart, addToCart, removeFromCart, updateQuantity };
};
```

### ✅ Hook에 들어가야 하는 것

- ✅ useState, useEffect
- ✅ localStorage 읽기/쓰기
- ✅ API 호출
- ✅ 이벤트 발생/구독
- ✅ alert, toast 등 UI 피드백
- ✅ Model 함수 호출

### ❌ Hook에 들어가면 안 되는 것

- ❌ 복잡한 계산 로직 (→ Model로)
- ❌ 비즈니스 규칙 (→ Model로)
- ❌ 데이터 변환 로직 (→ Model로)

---

## 🔍 실전 예시

### ❌ 잘못된 예시 (현재 많은 코드가 이렇게 되어 있음)

```typescript
// ❌ Hook에 비즈니스 로직이 너무 많음
const addToCart = (product: ProductWithUI) => {
  setCart((prev) => {
    // 비즈니스 로직이 Hook 안에!
    const existingItem = prev.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;

      if (newQuantity > product.stock) {
        alert(`재고는 ${product.stock}개까지만 있습니다.`);
        return prev;
      }

      const updated = prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    }

    const updated = [...prev, { product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updated));
    return updated;
  });
};
```

**문제점:**

- 비즈니스 로직이 Hook에 섞여 있음
- Model 함수를 활용하지 않음
- 테스트하기 어려움
- 재사용 불가능

---

### ✅ 올바른 예시

```typescript
// ✅ Model: 순수 비즈니스 로직
// models/cart.ts
export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    // 재고 초과 시 원본 반환
    if (newQuantity > product.stock) {
      return cart;
    }

    return cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

// ✅ Hook: 상태 관리 + Model 활용
// hooks/useCart.ts
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductWithUI) => {
    setCart((prev) => {
      // Model 함수 사용!
      const newCart = addItemToCart(prev, product);

      // UI 피드백 (Hook의 책임)
      if (newCart === prev) {
        alert(`재고는 ${product.stock}개까지만 있습니다.`);
      }

      return newCart;
    });
  };

  return { cart, addToCart };
};
```

**장점:**

- 비즈니스 로직은 Model에서 재사용 가능
- Hook은 React 관련 작업만 처리
- 테스트하기 쉬움
- 관심사 분리 명확

---

## 📋 비교 표

| 구분             | Model                          | Hook                                    |
| ---------------- | ------------------------------ | --------------------------------------- |
| **파일 위치**    | `models/cart.ts`               | `hooks/useCart.ts`                      |
| **역할**         | 비즈니스 로직                  | 상태 관리 + 부수 효과                   |
| **순수성**       | 순수 함수                      | 부수 효과 있음                          |
| **React 의존**   | ❌ 무관                        | ✅ React 전용                           |
| **useState**     | ❌ 사용 불가                   | ✅ 사용                                 |
| **useEffect**    | ❌ 사용 불가                   | ✅ 사용                                 |
| **localStorage** | ❌ 접근 불가                   | ✅ 접근 가능                            |
| **API 호출**     | ❌ 불가                        | ✅ 가능                                 |
| **alert/toast**  | ❌ 불가                        | ✅ 가능                                 |
| **테스트**       | 쉬움 (순수 함수)               | 상대적으로 어려움                       |
| **재사용**       | 어디서든 가능                  | React 컴포넌트만                        |
| **예시**         | `addItemToCart(cart, product)` | `const { cart, addToCart } = useCart()` |

---

## 💡 LocalStorage는 어디에?

### ❌ Model에 넣으면 안 되는 이유

```typescript
// ❌ 이렇게 하면 안 됨!
export const addItemToCart = (cart, product) => {
  const newCart = [...cart, { product, quantity: 1 }];

  // 부수 효과! 순수 함수가 아님!
  localStorage.setItem("cart", JSON.stringify(newCart));

  return newCart;
};
```

**문제점:**

1. **순수 함수가 아님** - 부수 효과 발생
2. **테스트 어려움** - localStorage mock 필요
3. **서버 사이드 불가** - Node.js에는 localStorage 없음
4. **재사용 불가** - localStorage 없는 환경에서 사용 불가

---

### ✅ Hook에 넣어야 하는 이유

```typescript
// ✅ Hook에서 처리
export const useCart = () => {
  const [cart, setCart] = useState([]);

  // localStorage는 Hook의 책임
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Model 함수 사용
    setCart((prev) => addItemToCart(prev, product));
  };

  return { cart, addToCart };
};
```

**장점:**

1. **Model은 순수 함수 유지** - 어디서든 재사용 가능
2. **Hook이 부수 효과 처리** - React 환경에서만 실행
3. **관심사 분리** - 각자의 책임만 수행
4. **테스트 용이** - Model은 순수 함수로 쉽게 테스트

---

## 🎓 핵심 원칙

### 1. Model은 순수하게

```typescript
// ✅ 순수 함수
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### 2. Hook은 Model을 활용

```typescript
// ✅ Hook에서 Model 함수 사용
const useShoppingCart = () => {
  const [items, setItems] = useState([]);

  const total = calculateTotal(items); // Model 함수 활용

  return { items, total };
};
```

### 3. 부수 효과는 Hook에서만

```typescript
// ✅ Hook에서만 부수 효과 처리
useEffect(() => {
  localStorage.setItem("items", JSON.stringify(items));
  analytics.track("cart_updated", { itemCount: items.length });
}, [items]);
```

---

## 🚀 실전 체크리스트

### Model 함수를 만들 때

- [ ] 모든 데이터를 파라미터로 받는가?
- [ ] 외부 상태에 의존하지 않는가?
- [ ] 부수 효과가 없는가?
- [ ] 같은 입력에 항상 같은 출력을 반환하는가?
- [ ] React 없이도 사용 가능한가?

### Hook을 만들 때

- [ ] Model 함수를 최대한 활용하는가?
- [ ] 비즈니스 로직을 Hook에 넣지 않았는가?
- [ ] useState/useEffect를 적절히 사용하는가?
- [ ] 부수 효과를 명확히 관리하는가?

---

## 📝 요약

```
┌─────────────────────────────────────────┐
│  "비즈니스 로직은 Model로,              │
│   상태 관리는 Hook으로,                 │
│   렌더링은 Component로"                 │
└─────────────────────────────────────────┘
```

**기억하기:**

- **Model** = 순수 함수, 어디서든 재사용
- **Hook** = React 상태 + 부수 효과 + Model 활용
- **Component** = Hook 사용 + UI 렌더링

🎯 **핵심**: Model은 순수하게, Hook은 Model을 활용하게!
