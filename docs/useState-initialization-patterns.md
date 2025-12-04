# React useState 초기값 패턴 가이드

> 복습용 - useState 초기화 핵심 정리

## 📚 목차

1. [초기값 패턴 4가지](#초기값-패턴-4가지)
2. [Lazy Initialization](#lazy-initialization)
3. [localStorage 연동](#localstorage-연동)
4. [실전 예시](#실전-예시)
5. [안티패턴](#안티패턴)

---

## 초기값 패턴 4가지

### 패턴 비교표

| 패턴            | 코드                    | 실행 시점            | 성능   | 사용           |
| --------------- | ----------------------- | -------------------- | ------ | -------------- |
| **직접 값**     | `useState(0)`           | 매번 평가 (문제없음) | ⭐⭐⭐ | ✅ 간단한 값   |
| **함수 호출**   | `useState(fn())`        | 매 렌더링            | ❌     | ❌ 사용 금지   |
| **함수 전달**   | `useState(fn)`          | 첫 렌더링만          | ⭐⭐⭐ | ✅ 외부 함수   |
| **화살표 함수** | `useState(() => {...})` | 첫 렌더링만          | ⭐⭐⭐ | ✅ 복잡한 로직 |

---

### 패턴 1: 직접 값

```typescript
const [count, setCount] = useState(0);
const [name, setName] = useState("홍길동");
const [items, setItems] = useState<Item[]>([]);
```

**언제:** 간단한 값 (숫자, 문자열, boolean, 빈 배열/객체)

---

### 패턴 2: 함수 호출 결과 ❌

```typescript
// ❌ 나쁜 예 - 매 렌더링마다 실행
const [cart, setCart] = useState(loadFromLocalStorage());

// 동작:
// 1렌더링: loadFromLocalStorage() 실행 → 사용 ✅
// 2렌더링: loadFromLocalStorage() 실행 → 무시 ❌
// 3렌더링: loadFromLocalStorage() 실행 → 무시 ❌
```

**문제:** 비효율적, 성능 낭비

---

### 패턴 3: 함수 전달 ✅

```typescript
// ✅ 좋은 예 - 첫 렌더링만 실행
const [cart, setCart] = useState(loadFromLocalStorage);

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
};
```

**언제:** 외부 함수 재사용, 간단한 로직

---

### 패턴 4: 화살표 함수 ✅

```typescript
// ✅ 좋은 예 - 첫 렌더링만 실행
const [cart, setCart] = useState(() => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
});
```

**언제:** 복잡한 로직, 여러 줄, try-catch 필요

---

## Lazy Initialization

### 왜 필요한가?

```typescript
// ❌ 나쁜 예
const [data, setData] = useState(expensiveCalculation());
// 매 렌더링마다 expensiveCalculation() 실행!

// ✅ 좋은 예
const [data, setData] = useState(() => expensiveCalculation());
// 첫 렌더링만 실행!
```

### 성능 비교

```typescript
function heavyCalculation() {
  console.time("계산");
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.random();
  }
  console.timeEnd("계산");
  return result;
}

// ❌ 함수 호출
const [bad] = useState(heavyCalculation());
// 콘솔: 계산: 150ms (매 렌더링마다!)

// ✅ Lazy
const [good] = useState(() => heavyCalculation());
// 콘솔: 계산: 150ms (첫 렌더링만!)
```

---

## localStorage 연동

### 패턴 1: 읽기만

```typescript
const [cart, setCart] = useState<CartItem[]>(() => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
});
```

---

### 패턴 2: 읽기 + 자동 저장

```typescript
const [cart, setCart] = useState<CartItem[]>(() => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
});

// 자동 저장
useEffect(() => {
  if (cart.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    localStorage.removeItem("cart");
  }
}, [cart]);
```

---

### 패턴 3: Custom Hook (추천)

```typescript
// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`localStorage 저장 실패:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

// 사용
const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
const [user, setUser] = useLocalStorage<User | null>("user", null);
```

---

## 실전 예시

### 예시 1: 장바구니

```typescript
// hooks/useCart.ts
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  return { cart, setCart };
};
```

---

### 예시 2: 테마 설정

```typescript
type Theme = "light" | "dark" | "system";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // localStorage 확인
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) return saved;

    // 시스템 설정 확인
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
};
```

---

## 안티패턴

### 1. 함수 호출 결과 전달

```typescript
// ❌ 안티패턴
const [data, setData] = useState(expensiveFunction());

// ✅ 해결책
const [data, setData] = useState(expensiveFunction);
// 또는
const [data, setData] = useState(() => expensiveFunction());
```

---

### 2. props를 초기값으로 사용

```typescript
// ❌ 안티패턴 - props 변경 시 반영 안 됨
const Component = ({ initialCount }: { initialCount: number }) => {
  const [count, setCount] = useState(initialCount);
  // initialCount 변경되어도 count는 변경 안 됨!
};

// ✅ 해결책 1: useEffect로 동기화
useEffect(() => {
  setCount(initialCount);
}, [initialCount]);

// ✅ 해결책 2: key로 리셋
<Component key={initialCount} initialCount={initialCount} />;

// ✅ 해결책 3: 그냥 props 사용
const Component = ({ count }: { count: number }) => {
  return <div>{count}</div>;
};
```

---

### 3. 복잡한 객체 매번 생성

```typescript
// ❌ 안티패턴
const [config, setConfig] = useState({
  api: { baseUrl: "https://api.example.com" },
  features: { darkMode: true },
});

// ✅ 해결책 1: Lazy
const [config, setConfig] = useState(() => ({
  api: { baseUrl: "https://api.example.com" },
  features: { darkMode: true },
}));

// ✅ 해결책 2: 상수로 분리
const DEFAULT_CONFIG = {
  api: { baseUrl: "https://api.example.com" },
  features: { darkMode: true },
} as const;

const [config, setConfig] = useState(DEFAULT_CONFIG);
```

---

## 체크리스트

### useState 초기값 작성 시

- [ ] 계산 비용이 높은가? → Lazy Initialization
- [ ] localStorage를 읽는가? → 반드시 Lazy
- [ ] 외부 함수를 호출하는가? → 함수 전달 또는 화살표 함수
- [ ] 여러 줄의 로직이 필요한가? → 화살표 함수
- [ ] 에러 처리가 필요한가? → 화살표 함수 + try-catch

---

## 핵심 정리

### 선택 가이드

```typescript
// 1. 간단한 값 → 직접 값
const [count, setCount] = useState(0);

// 2. 외부 함수 → 함수 전달
const [data, setData] = useState(loadData);

// 3. 복잡한 로직 → 화살표 함수
const [cart, setCart] = useState(() => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
});

// 4. localStorage → 항상 Lazy
const [settings, setSettings] = useState(() =>
  JSON.parse(localStorage.getItem("settings") || "{}")
);
```

### 성능 원칙

- ✅ 비싼 계산은 Lazy Initialization
- ✅ localStorage 읽기는 항상 Lazy
- ❌ 함수 호출 결과 전달 금지
- ✅ 복잡한 객체는 상수로 분리

---

**핵심: 비싼 계산은 Lazy Initialization으로!** 🚀
