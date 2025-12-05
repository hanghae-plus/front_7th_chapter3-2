# 프론트엔드 아키텍처 설명: 관심사 분리
이 프로젝트의 디렉토리 구조는 애플리케이션을 세 가지 핵심적인 **관심사(Concern)**에 따라 명확하게 분리하는 것을 목표로 합니다.

1.  **`entities`**: **데이터와 규칙 (What is it?)**
2.  **`hooks`**: **동작과 상태 (How does it work?)**
3.  **`components`**: **화면 구성 (How does it look?)**

```text
src/(basic or advanced)
├── entities/                  # [데이터와 규칙]
│   ├── cart/
│   │   ├── model/types.ts     # CartItem 타입
│   │   └── lib/calc.ts        # calculateCartTotal, calculateItemTotal (순수 함수)
│   ├── product/
│   │   ├── model/types.ts     # Product 타입
│   │   └── lib/stock.ts       # getRemainingStock (순수 함수)
│   └── coupon/
│       └── model/types.ts     # Coupon 타입
│
├── hooks/                     # [동작과 상태]
│   ├── useCart.ts             # useLocalStorage로 cart 상태 관리, calc.ts 함수 활용
│   ├── useProducts.ts         # 상품 CRUD, 재고 관리 로직
│   └── useCoupons.ts          # 쿠폰 CRUD, 쿠폰 적용 로직
│
└── components/                # [화면 구성]
    ├── cart/CartPage.tsx      # useCart, useCoupons 훅을 사용하여 화면 렌더링
    └── admin/AdminPage.tsx    # useProducts 훅을 사용하여 관리자 기능 수행
```
---

### 1. `entities` 디렉토리: 애플리케이션의 "두뇌"

- **역할**: 이 디렉토리는 애플리케이션의 가장 핵심적인 부분입니다. **순수한 데이터의 형태(타입)와 그 데이터를 다루는 순수한 비즈니스 규칙(순수 함수)만을 정의**합니다.
- **특징**:
    - **프레임워크 독립적**: 이 안의 코드(`types.ts`, `calc.ts` 등)는 React나 `useState` 같은 특정 기술에 대해 전혀 알지 못합니다. 오직 데이터와 그 데이터를 계산하는 로직만 존재합니다.
    - **높은 재사용성 및 테스트 용이성**: `calc.ts`의 `calculateCartTotal` 함수는 순수 함수이므로, 동일한 장바구니 데이터를 넣으면 항상 동일한 결과를 반환합니다. 따라서 예측이 가능하고 단위 테스트를 작성하기 매우 쉽습니다.
    - **도메인 중심**: `cart`, `product`처럼 데이터의 종류(도메인)에 따라 폴더가 나뉘어 있어, "상품과 관련된 모든 규칙은 `entities/product` 안에 있다"는 것을 명확히 알 수 있습니다.

### 2. `hooks` 디렉토리: "두뇌"와 "몸"을 연결하는 "신경계"

- **역할**: 이 디렉토리는 **상태(State)를 관리**하고, `entities`에 정의된 **순수한 규칙들을 실제 동작과 연결**하는 역할을 합니다. 또한 `localStorage`나 서버 API 통신 같은 **부수 효과(Side Effects)를 처리**합니다.
- **특징**:
    - **상태 관리의 중심**: `useCart` 훅은 `useState`나 `useLocalStorage`를 사용해 실제 장바구니 데이터를 들고 있습니다.
    - **동작 제공**: `addToCart`, `removeFromCart`처럼 컴포넌트가 호출할 함수(동작)들을 제공합니다.
    - **규칙의 "소비자"**: `useCart` 훅 내부에서는 `entities/cart/lib/calc.ts`에 있는 계산 함수들을 가져와 사용합니다. 예를 들어, 장바구니 총액이 필요할 때 `calculateCartTotal`을 호출하는 식입니다.
    - **부수 효과 격리**: `localStorage`에 데이터를 저장하는 것과 같은 "순수하지 않은" 작업들은 모두 이 `hooks` 계층에서 처리됩니다.

### 3. `components` 디렉토리: 애플리케이션의 "몸" (UI)

- **역할**: 이 디렉토리는 사용자에게 보여지는 **UI를 렌더링하는 책임**만을 집니다.
- **특징**:
    - **"Dumb" 컴포넌트**: 이 컴포넌트들은 "어떻게" 동작하는지에는 관심이 없습니다. 오직 `hooks`로부터 받은 데이터(`cart` 상태)를 화면에 그리고, 사용자가 버튼을 누르면 `hooks`로부터 받은 함수(`addToCart`)를 호출할 뿐입니다.
    - **상태를 소유하지 않음**: 페이지 컴포넌트(`CartPage.tsx`)는 직접 `useState`를 거의 사용하지 않습니다. 모든 상태와 로직은 `useCart()`, `useCoupons()` 같은 훅을 호출해서 가져옵니다.

---

### 데이터 흐름 요약

이 구조에서의 일반적인 데이터 흐름은 다음과 같습니다.

1.  **`CartPage.tsx`**가 렌더링됩니다.
2.  `CartPage.tsx` 내부에서 **`useCart()`** 훅을 호출합니다.
3.  **`useCart`** 훅은 `localStorage`에서 데이터를 가져와 `cart` 상태를 초기화하고, `addToCart` 같은 함수들을 준비합니다.
4.  `CartPage.tsx`는 `useCart`로부터 받은 `cart` 데이터를 화면에 그립니다.
5.  사용자가 '장바구니 추가' 버튼을 클릭하면, `CartPage.tsx`는 `useCart`로부터 받은 **`addToCart()`** 함수를 호출합니다.
6.  `addToCart()` 함수는 `entities/product/lib/stock.ts`의 `getRemainingStock` 같은 순수 함수로 재고를 확인한 후, `cart` 상태를 업데이트합니다.
7.  `cart` 상태가 변경되었으므로 `CartPage.tsx`가 리렌더링되어 변경된 내용이 화면에 반영됩니다.
