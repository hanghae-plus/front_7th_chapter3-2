# React 프로젝트 폴더 구조 가이드

> 복습용 - 프론트엔드 폴더 구조 핵심 정리

## 📚 목차

1. [폴더 네이밍 규칙](#폴더-네이밍-규칙)
2. [컴포넌트 폴더 패턴](#컴포넌트-폴더-패턴)
3. [models vs utils vs services](#models-vs-utils-vs-services)
4. [실무 구조 예시](#실무-구조-예시)
5. [의사결정 가이드](#의사결정-가이드)

---

## 폴더 네이밍 규칙

### 파일 타입별 규칙

| 타입           | 네이밍                 | 예시                             |
| -------------- | ---------------------- | -------------------------------- |
| React 컴포넌트 | PascalCase             | `Header.tsx`, `ProductCard.tsx`  |
| Custom Hook    | camelCase (use 접두사) | `useCart.ts`, `useSearch.ts`     |
| 유틸리티       | camelCase              | `formatters.ts`, `validators.ts` |
| 폴더           | kebab-case (소문자)    | `cart/`, `icons/`, `hooks/`      |

### 폴더 네이밍 원칙

```typescript
// ✅ 추천: 소문자 (kebab-case)
components/
├── cart/          # 소문자 - 단순 그룹
├── icons/         # 소문자 - 단순 그룹
└── layout/
    └── Header/    # 대문자 - 복잡한 모듈 (예외)

이유:
- 대소문자 구분 없는 파일시스템 호환
- URL 친화적
- 업계 표준
```

---

## 컴포넌트 폴더 패턴

### 패턴 1: 단순 그룹 (index.tsx 없음)

**언제:** 독립적인 컴포넌트들의 그룹

```typescript
components/cart/
├── ProductCard.tsx
├── CartItem.tsx
└── OrderSummary.tsx

// import
import ProductCard from '@/components/cart/ProductCard';
import CartItem from '@/components/cart/CartItem';
```

**특징:**

- ✅ 각 컴포넌트가 동등한 위치
- ✅ 명확한 import 경로
- ✅ 도메인별 분류

---

### 패턴 2: 복잡한 모듈 (index.tsx 사용)

**언제:** 메인 컴포넌트 + 서브 컴포넌트 구조

```typescript
components/layout/Header/
├── index.tsx          # 메인 컴포넌트
├── SearchBar.tsx      # 서브 (내부에서만 사용)
└── CartBadge.tsx      # 서브 (내부에서만 사용)

// index.tsx
import SearchBar from './SearchBar';
import CartBadge from './CartBadge';

const Header = ({ ... }) => {
  return (
    <header>
      <SearchBar />
      <CartBadge />
    </header>
  );
};

export default Header;

// import
import Header from '@/components/layout/Header';  // ✅
```

**특징:**

- ✅ 캡슐화 (내부 구현 숨김)
- ✅ 서브 컴포넌트는 외부에서 직접 import 안 함
- ✅ 하나의 모듈처럼 동작

---

### index.tsx 사용 판단 기준

```typescript
// ✅ index.tsx 사용
Header/
├── index.tsx       // 메인
├── SearchBar.tsx   // 서브 (Header 내부에서만)
└── CartBadge.tsx   // 서브 (Header 내부에서만)

// ❌ index.tsx 불필요
cart/
├── ProductCard.tsx  // 독립 컴포넌트
├── CartItem.tsx     // 독립 컴포넌트
└── OrderSummary.tsx // 독립 컴포넌트
```

---

## models vs utils vs services

### models/ - 도메인 비즈니스 로직

**특징:** 특정 도메인, 순수 함수, UI 무관

```typescript
// models/cart.ts
import { CartItem, Product } from "@/types";

/**
 * 장바구니 아이템 총액 계산
 */
export const calculateItemTotal = (
  cart: CartItem[],
  item: CartItem
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(cart, item);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니에 상품 추가
 */
export const addItemToCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  const existing = cart.find((item) => item.product.id === product.id);

  if (existing) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};
```

---

### utils/ - 범용 유틸리티

**특징:** 도메인 독립적, 어디서든 사용 가능

```typescript
// utils/formatters.ts

export const formatCurrency = (amount: number): string => {
  return `₩${amount.toLocaleString()}`;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

// utils/validators.ts

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

---

### services/ - API 통신

**특징:** 외부 서비스 연동, 비동기

```typescript
// services/api/cartService.ts

export const getCart = async (): Promise<CartItem[]> => {
  const response = await apiClient.get("/cart");
  return response.data;
};

export const addToCart = async (
  productId: string,
  quantity: number
): Promise<CartItem> => {
  const response = await apiClient.post("/cart/items", {
    productId,
    quantity,
  });
  return response.data;
};
```

---

### 비교표

| 구분            | models/              | utils/           | services/      |
| --------------- | -------------------- | ---------------- | -------------- |
| **목적**        | 도메인 로직          | 범용 유틸        | API 통신       |
| **도메인 의존** | ✅ 특정 도메인       | ❌ 독립적        | ✅ 특정 도메인 |
| **순수 함수**   | ✅ 필수              | ✅ 필수          | ❌ 비동기      |
| **예시**        | `calculateCartTotal` | `formatCurrency` | `getCart`      |

---

## 실무 구조 예시

### 중규모 프로젝트 (추천)

```typescript
src/
├── components/
│   ├── layout/
│   │   ├── Header/              # 복잡한 모듈 (대문자 + index.tsx)
│   │   │   ├── index.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── CartBadge.tsx
│   │   └── NotificationList/
│   │       └── index.tsx
│   │
│   ├── cart/                    # 단순 그룹 (소문자)
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   └── OrderSummary.tsx
│   │
│   ├── common/                  # 공통 UI
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   │
│   └── icons/
│       ├── CartIcon.tsx
│       └── CloseIcon.tsx
│
├── pages/
│   ├── CartPage.tsx
│   └── AdminPage.tsx
│
├── hooks/
│   ├── useCart.ts
│   └── useSearch.ts
│
├── models/
│   ├── cart.ts
│   └── product.ts
│
├── services/
│   └── api/
│       └── cartService.ts
│
├── utils/
│   ├── formatters.ts
│   └── validators.ts
│
└── types/
    └── index.ts
```

---

### Feature-based (대규모)

```typescript
src/
├── features/
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── models/
│   │   └── pages/
│   │
│   └── product/
│       ├── components/
│       └── hooks/
│
└── shared/
    ├── components/
    ├── hooks/
    └── utils/
```

---

## 의사결정 가이드

### Q1: 새 컴포넌트를 어디에?

```typescript
// 1. 특정 도메인에 속하는가?
→ Yes: components/[domain]/

// 2. 레이아웃 컴포넌트인가?
→ Yes: components/layout/

// 3. 공통 UI인가?
→ Yes: components/common/

// 4. 아이콘인가?
→ Yes: components/icons/
```

---

### Q2: index.tsx를 만들어야 할까?

```typescript
// 1. 메인 + 서브 컴포넌트 구조인가?
→ Yes: index.tsx 사용

// 2. 독립적인 컴포넌트들인가?
→ Yes: index.tsx 불필요

예시:
✅ Header/ (메인 + 서브) → index.tsx 사용
❌ cart/ (독립 컴포넌트들) → index.tsx 불필요
```

---

### Q3: models vs utils?

```typescript
// 특정 도메인에 종속되는가?

✅ models/ (도메인 종속)
- calculateCartTotal(cart, coupon)
- isProductInStock(product)

✅ utils/ (도메인 독립)
- formatCurrency(1000)
- isValidEmail(email)
```

---

## 핵심 원칙

### 1. 목적에 맞게 선택

```typescript
// ❌ 잘못된 생각
"모든 폴더를 소문자로 통일";

// ✅ 올바른 생각
"복잡한 모듈은 대문자 + index.tsx";
"단순 그룹은 소문자";
```

### 2. 확장 가능성 고려

```typescript
// 처음: 간단하게
components/ProductCard.tsx

// 복잡해지면: 폴더로
components/ProductCard/
├── index.tsx
├── ProductImage.tsx
└── ProductInfo.tsx
```

### 3. 일관성보다 이유가 중요

- Header: 복잡한 모듈 → 대문자 + index.tsx
- cart: 단순 그룹 → 소문자

---

## 체크리스트

### 새 컴포넌트 생성 시

- [ ] 도메인 파악
- [ ] 재사용 범위 확인
- [ ] 복잡도 평가
- [ ] 적절한 위치 선택
- [ ] index.tsx 필요 여부 판단

---

## 요약

| 구분            | 폴더명     | index.tsx | 예시                           |
| --------------- | ---------- | --------- | ------------------------------ |
| **복잡한 모듈** | PascalCase | ✅        | `Header/`, `NotificationList/` |
| **단순 그룹**   | kebab-case | ❌        | `cart/`, `icons/`              |
| **기타**        | kebab-case | ❌        | `hooks/`, `utils/`, `models/`  |

**핵심: 구조의 목적에 맞게 선택!** 🚀
