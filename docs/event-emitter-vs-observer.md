# Event Emitter vs Observer 패턴

> 주니어 개발자를 위한 디자인 패턴 비교 가이드

## 📚 목차

1. [핵심 개념](#핵심-개념)
2. [Event Emitter 패턴](#event-emitter-패턴)
3. [Observer 패턴](#observer-패턴)
4. [비교표](#비교표)
5. [실전 예시](#실전-예시)
6. [언제 무엇을 사용할까](#언제-무엇을-사용할까)

---

## 핵심 개념

### 공통점

둘 다 **"변화를 알려주는"** 패턴입니다.

```
상태 변경 → 관심있는 곳에 알림 → 자동 업데이트
```

### 차이점

| 구분       | Event Emitter       | Observer    |
| ---------- | ------------------- | ----------- |
| **별칭**   | Pub/Sub 패턴        | 관찰자 패턴 |
| **중재자** | ✅ 있음 (Event Bus) | ❌ 없음     |
| **결합도** | 느슨함              | 강함        |

---

## Event Emitter 패턴

### 개념

**중재자(Event Bus)를 통해 간접적으로 통신**

```
발행자 → Event Bus → 구독자
  ↓         ↓          ↓
모름      중재자      모름
```

### 코드 예시

```typescript
// 1. 이벤트 발행 (Publish)
const addToCart = (product) => {
  // 상태 변경
  cart.push(product);

  // 이벤트 발행 - 누가 듣는지 모름!
  window.dispatchEvent(new Event("cart-updated"));
};

// 2. 이벤트 구독 (Subscribe)
useEffect(() => {
  const handleUpdate = () => {
    console.log("장바구니가 업데이트됨!");
  };

  // 구독 시작
  window.addEventListener("cart-updated", handleUpdate);

  // 구독 해제
  return () => {
    window.removeEventListener("cart-updated", handleUpdate);
  };
}, []);
```

### 장점

✅ **느슨한 결합** - 발행자와 구독자가 서로 모름  
✅ **확장성** - 새 구독자 추가 쉬움  
✅ **독립성** - 컴포넌트 간 의존성 없음

### 단점

❌ **디버깅 어려움** - 누가 발행했는지 추적 어려움  
❌ **이벤트 이름 관리** - 오타 위험  
❌ **메모리 누수** - 구독 해제 잊으면 문제

---

## Observer 패턴

### 개념

**직접 연결하여 통신**

```
Subject (주체) → Observer (관찰자)
     ↓              ↓
  알고 있음      알고 있음
```

### 코드 예시

```typescript
// 1. Subject (관찰 대상)
class Cart {
  private observers: Observer[] = [];
  private items: Product[] = [];

  // 옵저버 등록
  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  // 옵저버 제거
  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // 모든 옵저버에게 알림
  notify() {
    this.observers.forEach((observer) => observer.update(this.items));
  }

  // 상태 변경
  addItem(product: Product) {
    this.items.push(product);
    this.notify(); // 직접 호출!
  }
}

// 2. Observer (관찰자)
class CartDisplay {
  update(items: Product[]) {
    console.log("장바구니 업데이트:", items);
  }
}

// 3. 사용
const cart = new Cart();
const display = new CartDisplay();

cart.subscribe(display); // 직접 등록
cart.addItem(product); // 자동으로 display.update() 호출됨
```

### 장점

✅ **명확한 관계** - 누가 누구를 관찰하는지 명확  
✅ **타입 안전** - TypeScript에서 타입 체크 가능  
✅ **디버깅 쉬움** - 호출 흐름 추적 쉬움

### 단점

❌ **강한 결합** - Subject와 Observer가 서로 알아야 함  
❌ **확장성** - 새 옵저버 추가 시 Subject 수정 필요  
❌ **순환 참조** - 메모리 누수 위험

---

## 비교표

### 구조 비교

```typescript
// Event Emitter (Pub/Sub)
발행자 --이벤트--> Event Bus --이벤트--> 구독자
  ↓                  ↓                    ↓
모름              중재자                모름

// Observer
Subject --직접 호출--> Observer
  ↓                      ↓
알고 있음            알고 있음
```

### 특징 비교

| 특징          | Event Emitter       | Observer     |
| ------------- | ------------------- | ------------ |
| **결합도**    | 느슨함 (Loose)      | 강함 (Tight) |
| **중재자**    | Event Bus           | 없음         |
| **확장성**    | 높음                | 낮음         |
| **디버깅**    | 어려움              | 쉬움         |
| **타입 안전** | 어려움              | 쉬움         |
| **사용 예**   | Redux, EventEmitter | RxJS, MobX   |

---

## 실전 예시

### Event Emitter - 장바구니 동기화

```typescript
// hooks/useCart.ts
export const useCart = () => {
  const [cart, setCart] = useState([]);

  // 구독
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("cart");
      setCart(JSON.parse(saved));
    };

    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  // 발행
  const addToCart = (product) => {
    const updated = [...cart, product];
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated")); // 발행!
    setCart(updated);
  };

  return { cart, addToCart };
};

// 여러 컴포넌트에서 사용
const ProductList = () => {
  const { addToCart } = useCart(); // 구독자 1
  // ...
};

const CartArea = () => {
  const { cart } = useCart(); // 구독자 2
  // ...
};
```

### Observer - 테마 변경

```typescript
// Subject
class ThemeManager {
  private observers: ThemeObserver[] = [];
  private theme: "light" | "dark" = "light";

  subscribe(observer: ThemeObserver) {
    this.observers.push(observer);
  }

  setTheme(theme: "light" | "dark") {
    this.theme = theme;
    this.observers.forEach((obs) => obs.onThemeChange(theme));
  }
}

// Observer
class Header implements ThemeObserver {
  onThemeChange(theme: string) {
    this.element.className = `header-${theme}`;
  }
}

class Sidebar implements ThemeObserver {
  onThemeChange(theme: string) {
    this.element.className = `sidebar-${theme}`;
  }
}

// 사용
const themeManager = new ThemeManager();
themeManager.subscribe(new Header());
themeManager.subscribe(new Sidebar());
themeManager.setTheme("dark"); // 모든 옵저버에게 알림
```

---

## 언제 무엇을 사용할까

### Event Emitter 사용

```typescript
✅ 사용하는 경우:
- 컴포넌트 간 느슨한 결합 필요
- 발행자와 구독자가 서로 모르는 게 좋음
- 동적으로 구독자 추가/제거
- 전역 이벤트 (로그인, 알림 등)

예시:
- 장바구니 동기화
- 전역 알림 시스템
- 로그인/로그아웃 이벤트
- 실시간 데이터 업데이트
```

### Observer 사용

```typescript
✅ 사용하는 경우:
- 명확한 관계 필요
- 타입 안전성 중요
- 디버깅 용이성 필요
- 1:N 관계가 명확함

예시:
- 폼 검증 (Form → Validators)
- 테마 변경 (ThemeManager → Components)
- 데이터 바인딩 (Model → View)
- 상태 관리 (Store → Components)
```

---

## 실무 라이브러리

### Event Emitter 계열

```typescript
// 1. Redux
dispatch({ type: "ADD_TO_CART" }); // 발행
useSelector((state) => state.cart); // 구독

// 2. Node.js EventEmitter
eventEmitter.emit("data", payload);
eventEmitter.on("data", handler);

// 3. 현재 프로젝트
window.dispatchEvent(new Event("cart-updated"));
window.addEventListener("cart-updated", handler);
```

### Observer 계열

```typescript
// 1. RxJS
subject.next(value);        // 발행
subject.subscribe(handler); // 구독

// 2. MobX
@observable cart = [];      // Subject
@observer CartComponent     // Observer
```

---

## 핵심 정리

### Event Emitter (Pub/Sub)

```
특징: 느슨한 결합, Event Bus 사용
장점: 확장성, 독립성
단점: 디버깅 어려움
사용: 전역 이벤트, 컴포넌트 간 통신
```

### Observer

```
특징: 직접 연결, 명확한 관계
장점: 타입 안전, 디버깅 쉬움
단점: 강한 결합, 확장성 낮음
사용: 1:N 관계, 데이터 바인딩
```

---

## 체크리스트

**어떤 패턴을 선택할까?**

- [ ] 컴포넌트가 서로 모르는 게 좋은가? → Event Emitter
- [ ] 명확한 관계가 필요한가? → Observer
- [ ] 동적으로 구독자가 추가되는가? → Event Emitter
- [ ] 타입 안전성이 중요한가? → Observer
- [ ] 디버깅이 중요한가? → Observer
- [ ] 전역 이벤트인가? → Event Emitter

---

**핵심: 상황에 맞는 패턴을 선택하자!** 🚀
