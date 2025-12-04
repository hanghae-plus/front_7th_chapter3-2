# React에서 localStorage 변경을 다른 컴포넌트에 알리는 방법

> localStorage 저장만으로는 React 컴포넌트가 동기화되지 않는 이유와 해결 방법

## 🚨 문제 상황

### localStorage에 저장했는데 왜 다른 컴포넌트는 업데이트 안 될까?

```typescript
// ComponentA - 장바구니에 상품 추가
const addToCart = (product) => {
  setCart((prev) => {
    const updated = [...prev, product];
    localStorage.setItem("cart", JSON.stringify(updated)); // 저장!
    return updated;
  });
};

// ComponentB - 장바구니 표시
const { cart } = useCart();
console.log(cart); // [] ← 여전히 비어있음! 왜?
```

---

## 💡 핵심 원인

### React는 localStorage를 감시하지 않습니다!

```
localStorage 변경 → React는 모름 → 리렌더링 안 됨
```

**이유:**

- `useState`는 **React 상태만** 추적합니다
- localStorage는 **React 외부** 저장소입니다
- localStorage가 변경되어도 **React는 감지하지 못합니다**

---

## 🔄 동작 원리 비교

### ❌ 기존 방식 (동기화 안 됨)

```typescript
// useCart.ts
export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const updated = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated; // 현재 컴포넌트만 업데이트!
    });
  };

  return { cart, addToCart };
};
```

**문제:**

```
1. ComponentA에서 addToCart() 호출
   ↓
2. ComponentA의 cart만 업데이트
   ↓
3. localStorage에 저장
   ↓
4. ComponentB는 변경을 모름 ❌
```

---

### ✅ 해결 방법 (Event Emitter 패턴)

```typescript
// useCart.ts
export const useCart = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 1. localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("cart");
      setCart(saved ? JSON.parse(saved) : []);
    };

    // 이벤트 구독
    window.addEventListener("cart-updated", handleStorageChange);

    return () => {
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, []);

  // 2. 변경 시 이벤트 발행
  const addToCart = (product) => {
    setCart((prev) => {
      const updated = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated")); // 📢 알림!
      return updated;
    });
  };

  return { cart, addToCart };
};
```

**동작:**

```
1. ComponentA에서 addToCart() 호출
   ↓
2. localStorage에 저장
   ↓
3. "cart-updated" 이벤트 발행 📢
   ↓
4. 모든 구독자(ComponentA, ComponentB)의 handleStorageChange 실행
   ↓
5. 각 컴포넌트에서 localStorage 다시 읽기
   ↓
6. setCart() 호출 → 모든 컴포넌트 리렌더링 ✅
```

---

## 📊 패턴 비교

### Event Emitter (Pub/Sub) 패턴

```
발행자 (Publisher)          Event Bus          구독자 (Subscriber)
    ↓                          ↓                      ↓
addToCart()  →  dispatchEvent("cart-updated")  →  addEventListener()
                      ↓
                  window (중재자)
                      ↓
              모든 구독자에게 전달
```

**특징:**

- ✅ 느슨한 결합 (발행자와 구독자가 서로 모름)
- ✅ 확장성 (새 구독자 추가 쉬움)
- ✅ 상태관리 라이브러리 없이 동기화 가능

---

## 🎯 실전 예시

### 장바구니 동기화

```typescript
// ProductList 컴포넌트
const ProductList = () => {
  const { addToCart } = useCart();

  return <button onClick={() => addToCart(product)}>장바구니 담기</button>;
};

// CartArea 컴포넌트
const CartArea = () => {
  const { cart } = useCart();

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

**결과:**

- ProductList에서 "장바구니 담기" 클릭
- CartArea가 자동으로 업데이트됨! ✅

---

## 🔧 다른 해결 방법

### 1. Context API

```typescript
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
```

**장점:** React 공식 방법  
**단점:** Provider로 감싸야 함

---

### 2. 상태관리 라이브러리 (Zustand)

```typescript
const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),
}));
```

**장점:** 간단하고 강력  
**단점:** 외부 라이브러리 필요

---

## 📋 비교표

| 방법              | 장점                   | 단점          | 추천   |
| ----------------- | ---------------------- | ------------- | ------ |
| **Event Emitter** | 외부 라이브러리 불필요 | 디버깅 어려움 | 소규모 |
| **Context API**   | React 공식             | Provider 필요 | 중규모 |
| **Zustand/Redux** | 강력한 기능            | 학습 곡선     | 대규모 |

---

## ✅ 핵심 정리

### localStorage는 "수동 저장소"입니다

```typescript
// ❌ 이렇게 동작하지 않습니다
localStorage.setItem("cart", data);
// → 자동으로 모든 컴포넌트 업데이트 (안 됨!)

// ✅ 이벤트로 알려줘야 합니다
localStorage.setItem("cart", data);
window.dispatchEvent(new Event("cart-updated")); // 📢
// → 구독자들이 감지하고 업데이트
```

### React 상태 vs localStorage

| 구분          | React State      | localStorage  |
| ------------- | ---------------- | ------------- |
| **반응형**    | ✅ 자동          | ❌ 수동       |
| **감지**      | ✅ React가 추적  | ❌ 추적 안 함 |
| **변경 알림** | ✅ 자동 리렌더링 | ❌ 알림 없음  |

---

## 💡 결론

**localStorage에 저장했다고 React가 자동으로 아는 게 아닙니다!**

해결 방법:

1. **Event Emitter 패턴** - 이벤트로 수동 알림
2. **Context API** - 상태 공유
3. **상태관리 라이브러리** - 전역 상태

**핵심:** localStorage는 저장소일 뿐, React에게 변경을 알려줘야 합니다! 📢

---

## 🔗 참고 자료

- [MDN - Window: storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [React - State Management](https://react.dev/learn/managing-state)
- [Event Emitter Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
