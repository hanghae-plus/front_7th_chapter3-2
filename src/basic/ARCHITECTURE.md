## basic 모듈 아키텍처

이 문서는 `src/basic` 폴더의 구조와 역할을 정리하고,  
`.github/pull_request_template.md` 24–29 라인의 리팩터링 체크리스트를 어떻게 만족하는지 설명합니다.

---

## 0. 구조를 나눈 이유 (Why We Split the Structure)

### 0.1 초기 문제점

리팩터링 전 `App.tsx`는 다음과 같은 문제가 있었습니다:

- **거대한 단일 파일**: 1,000줄 이상의 코드가 한 파일에 집중
- **관심사 혼재**: 상태 관리, 비즈니스 로직, UI 렌더링이 모두 섞여 있음
- **재사용 불가**: 장바구니 로직을 다른 화면에서 쓰고 싶어도 `App.tsx`에서 꺼내기 어려움
- **테스트 어려움**: 비즈니스 로직만 테스트하고 싶어도 컴포넌트 전체를 렌더링해야 함
- **유지보수 어려움**: "상품 추가 로직을 바꾸고 싶다" → `App.tsx` 전체를 읽어야 함

### 0.2 구조 분리의 목표

1. **관심사 분리 (Separation of Concerns)**
   - 데이터/비즈니스 로직과 UI를 분리
   - 각 레이어가 명확한 책임을 가지도록

2. **재사용성 향상**
   - 도메인 로직을 여러 화면에서 재사용 가능하도록
   - 엔티티 UI 컴포넌트를 여러 곳에서 재사용 가능하도록

3. **테스트 용이성**
   - 비즈니스 로직을 UI 없이 독립적으로 테스트
   - UI 컴포넌트를 props만으로 테스트

4. **확장성**
   - 새로운 기능 추가 시 기존 코드에 최소한의 영향
   - 각 레이어가 독립적으로 진화 가능

5. **가독성/유지보수성**
   - "어디를 수정해야 하나?"를 쉽게 찾을 수 있도록
   - 코드 변경의 영향 범위를 명확하게

### 0.3 선택한 구조: 계층형 아키텍처 (Layered Architecture)

```
┌─────────────────────────────────────┐
│         App.tsx (셸)                │  ← 라우팅, 레이아웃, 훅 조합
├─────────────────────────────────────┤
│    components/ui/ (페이지)           │  ← 페이지 수준 UI
│    - AdminPage.tsx                  │
│    - CartPage.tsx                   │
├─────────────────────────────────────┤
│  components/features/ (기능)         │  ← 기능 단위 UI 조합 (향후)
│  - cart/CartFeature.tsx              │
│  - product/ProductListFeature.tsx   │
├─────────────────────────────────────┤
│  components/entities/ (엔티티 UI)    │  ← 도메인 객체 표현
│  - product/ProductCard.tsx          │
│  - cart/CartItemRow.tsx             │
│  - coupon/CouponCard.tsx            │
├─────────────────────────────────────┤
│      hooks/ (비즈니스 로직)          │  ← 상태 관리, 계산, 검증
│      - useCart.ts                   │
│      - useProducts.ts               │
│      - useCoupons.ts                │
│      - useNotifications.ts          │
├─────────────────────────────────────┤
│      utils/ (순수 함수)              │  ← 계산, 포맷팅, 검증 (향후)
│      - cartCalculations.ts          │
│      - formatters.ts                │
│      - validators.ts                │
└─────────────────────────────────────┘
```

**데이터 흐름:**
1. `hooks/*`에서 상태/비즈니스 로직 관리
2. `App.tsx`에서 여러 훅을 조합
3. `components/ui/*` (또는 `features/*`)에서 훅 결과를 받아 UI 렌더링
4. `components/entities/*`에서 개별 엔티티를 표현

이 구조는 **Feature-Sliced Design (FSD)**의 사고방식과 유사하며,  
React/TypeScript 프로젝트에 맞게 적용한 버전입니다.

---

## 1. 상위 개요

- **`App.tsx`**
  - 전역 레이아웃/헤더/모드 전환(쇼핑몰 ↔ 관리자)을 담당하는 **셸 컴포넌트**.
  - 도메인 훅(`useCart`, `useProducts`, `useCoupons`, `useNotifications`)을 조합해서 상태/비즈니스 로직을 가져오고,
  - 그 결과를 페이지 컴포넌트인 `AdminPage`, `CartPage`에 props로 내려주는 역할만 수행.

- **`hooks/`**
  - 장바구니, 상품, 쿠폰, 알림 등 **도메인 상태와 비즈니스 로직을 담당하는 훅**이 위치.
  - 컴포넌트(UI)에 의존하지 않고, 상태/계산/검증만 처리하는 레이어.

- **`components/ui/`**
  - `AdminPage`, `CartPage`와 같은 **페이지 수준 UI 컴포넌트**가 위치.
  - 상태는 props로 받고, 화면을 렌더링하는 데만 집중.

> 데이터/로직은 hooks로, 화면은 UI 컴포넌트로 분리되어  
> “데이터 흐름에 맞는 계층 구조”를 이루도록 설계되어 있습니다.

---

## 2. hooks – 도메인 상태와 비즈니스 로직

### 2.1 `hooks/useCart.ts`

**책임: 장바구니 + 선택된 쿠폰과 관련된 모든 도메인 상태/계산/재고 관리**

- 상태
  - `cart: CartItem[]`
  - `selectedCoupon: Coupon | null`
  - `totals: { totalBeforeDiscount; totalAfterDiscount }`
  - `totalItemCount: number`
- 제공 함수
  - `addToCart(product)`  
    - 재고 부족(`OUT_OF_STOCK`) / 재고 초과(`EXCEED_STOCK`) 여부를 반환값으로 알려줌.
  - `removeFromCart(productId)`
  - `updateQuantity(productId, newQuantity, product?)`
  - `getRemainingStock(product)`
  - `calculateItemTotal(cartItem)`
  - `clearCart()` (장바구니 비우고 선택 쿠폰 초기화)
- 부가 로직
  - `cart`를 `localStorage('cart')`와 자동 동기화.

> 장바구니 도메인에 대한 “추가/삭제/수량 변경/총액/재고” 로직이 모두 훅으로 모여 있습니다.

---

### 2.2 `hooks/useProducts.ts`

**책임: 상품 목록, 검색, 관리자 상품 폼 상태 관리**

- 상태
  - `products: ProductWithUI[]` (`localStorage('products')`와 동기화)
  - `searchTerm`, `debouncedSearchTerm`
  - `filteredProducts` (디바운스된 검색어 기준 상품 필터링)
  - `editingProduct: string | null`
  - `productForm` (이름, 가격, 재고, 설명, 할인 정보)
- 제공 함수
  - `addProduct(newProductWithoutId)`
  - `updateProduct(productId, updates)`
  - `deleteProduct(productId)`
  - `startEditProduct(product)` → 수정 폼 상태로 세팅

> 상품 CRUD와 검색 로직이 모두 컴포넌트 밖으로 빠져나가 훅에 모여 있습니다.

---

### 2.3 `hooks/useCoupons.ts`

**책임: 쿠폰 목록 관리**

- 상태
  - `coupons: Coupon[]` (`localStorage('coupons')`와 동기화)
- 제공 함수
  - `addCoupon(newCoupon)`  
    - 중복 코드(`code`)가 있을 경우 `{ ok: false, reason: 'DUPLICATE_CODE' }` 반환
    - 성공 시 `{ ok: true }`
  - `deleteCoupon(couponCode)`

> 중복 코드 검증 로직이 훅 안으로 들어와 있고, 컴포넌트는 결과에 따라 알림만 보여주도록 분리됩니다.

---

### 2.4 `hooks/useNotifications.ts`

**책임: 전역 알림(토스트) 상태 관리**

- 상태
  - `notifications: { id; message; type }[]`
- 제공 함수
  - `addNotification(message, type?)`
    - 3초 후 자동으로 해당 알림을 제거하는 타이머 포함
  - `removeNotification(id)`

`App.tsx`에서 이 훅을 사용하여, 화면 상단 우측에 토스트 UI를 렌더링합니다.

---

## 3. App.tsx – 레이아웃/조합/도메인 규칙

`App.tsx`는 더 이상 개별 도메인 상태를 직접 관리하지 않고,  
**각 도메인 훅을 조합해서 페이지에 필요한 데이터를 전달하는 역할**을 합니다.

- 사용 훅
  - `useProducts({ initialProducts })`
  - `useCart()`
  - `useCoupons({ initialCoupons })`
  - `useNotifications()`
- 추가 비즈니스 규칙 (훅 조합 레벨에서 처리)
  - `applyCoupon(coupon)`  
    - 현재 장바구니 총액(`totals.totalAfterDiscount`)이 10,000원 미만인데  
      percentage 쿠폰이면 에러 알림을 띄우고 적용하지 않음.
    - 조건을 만족하면 `setSelectedCoupon` + 성공 알림.
  - `completeOrder()`  
    - 주문번호(`ORD-${Date.now()}`)를 생성하고 성공 알림 표시 후,
      `clearCart()`로 장바구니를 비웁니다.
  - 상품/쿠폰 관련 토스트 래퍼 함수
    - `addProductWithToast`, `updateProductWithToast`  
      → 제품 추가/수정 후 “성공” 알림만 씌운 래퍼
    - `addCouponWithToast`  
      → 중복 코드면 에러 알림, 아니면 성공 알림

이렇게 해서 **도메인 로직은 훅**,  
**도메인 간 규칙(예: 쿠폰 적용 조건)은 App 셸**에서 관리하는 구조입니다.

---

## 4. UI 컴포넌트 계층 (`components/ui`)

### 4.1 `components/ui/AdminPage.tsx`

- "관리자 대시보드" 페이지 UI를 담당합니다.
- 주요 역할
  - 상품/쿠폰 관리 탭 UI
  - 상품 테이블, 쿠폰 카드 리스트, 폼 UI 렌더링
  - 상품/쿠폰 삭제 버튼, 폼 제출 등에서  
    props로 받은 핸들러(`startEditProduct`, `deleteProduct` 등)를 호출.
- 상태/비즈니스 로직은 전부 props로 받으며, 내부에서 새 `useState`를 만들지 않습니다.

**사용하는 Entities 컴포넌트:**
- `entities/product/ProductRow.tsx` - 상품 테이블의 각 행을 렌더링
- `entities/coupon/CouponCard.tsx` - 쿠폰 카드를 렌더링

**리팩터링 효과:**
- 상품 테이블 행 UI와 쿠폰 카드 UI가 entities로 분리되어 재사용 가능
- 페이지 컴포넌트 코드가 더 간결해짐 (약 40줄 감소)

### 4.2 `components/ui/CartPage.tsx`

- "쇼핑몰 + 장바구니" 페이지 UI를 담당합니다.
- 주요 역할
  - 상품 카드 리스트 렌더링 (`filteredProducts`를 사용)
  - 장바구니 리스트, 수량 조절, 삭제 버튼, 할인율 표시
  - 쿠폰 선택 드롭다운, 결제 정보 영역 렌더링
  - 버튼 클릭 시, props로 받은 `addToCart`, `updateQuantity`, `applyCoupon`, `completeOrder` 등을 호출.

**사용하는 Entities 컴포넌트:**
- `entities/product/ProductCard.tsx` - 상품 카드를 렌더링
- `entities/cart/CartItemRow.tsx` - 장바구니 아이템 하나를 렌더링
- `entities/cart/CartSummary.tsx` - 결제 정보 요약 영역을 렌더링
- `entities/coupon/CouponSelect.tsx` - 쿠폰 선택 드롭다운을 렌더링

**리팩터링 효과:**
- 상품 카드, 장바구니 아이템, 결제 요약, 쿠폰 선택 UI가 모두 entities로 분리
- 페이지 컴포넌트 코드가 대폭 간결해짐 (약 120줄 감소)
- 각 엔티티 UI 변경 시 해당 파일만 수정하면 됨

> 두 페이지 모두 **도메인 훅을 직접 호출하지 않고**,  
> App으로부터 "이미 계산/준비된 데이터와 콜백"만 받는 순수 UI입니다.  
> 또한 **entities 컴포넌트를 사용**하여 엔티티 단위 UI를 재사용하고 있습니다.

---

## 5. PR 템플릿 체크리스트와의 매핑

`.github/pull_request_template.md` 중 24–29 라인:

> 24. Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?  
> 25. 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?  
> 26. 계산함수는 순수함수로 작성이 되었나요?  
> 27. 특정 Entitiy만 다루는 함수는 분리되어 있나요?  
> 28. 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?  
> 29. 데이터 흐름에 맞는 계층구조를 이루고 …

이 구조가 각 항목을 어떻게 만족하는지:

- **24–25: 로직을 훅으로 이동 & 책임 분리**
  - 장바구니/상품/쿠폰/알림 로직이 각각
    `useCart`, `useProducts`, `useCoupons`, `useNotifications`로 옮겨졌습니다.
  - 각 훅은 자기 도메인(장바구니/상품/쿠폰/알림)에 대해서만 책임을 가지며,
    UI나 다른 도메인에 직접 의존하지 않습니다.

- **26: 계산 함수의 순수성**
  - `useCart` 내의 `calculateItemTotal`, `totals` 계산 로직은  
    “입력(cart, selectedCoupon) → 계산된 결과” 형태로 순수 함수 구조를 따릅니다.
  - 향후에는 이 계산들을 `utils/cartCalculations.ts` 같은 순수 함수 모듈로 추출해  
    테스트/재사용을 더 쉽게 할 수 있습니다.

- **27: 엔티티별 함수 분리**
  - 장바구니 관련 함수 → `useCart`
  - 상품 관련 함수 → `useProducts`
  - 쿠폰 관련 함수 → `useCoupons`
  - 알림 관련 함수 → `useNotifications`
  - 각 훅은 하나의 엔티티/도메인만 다루기 때문에 책임이 명확합니다.

- **28: 엔티티 컴포넌트 vs UI 컴포넌트 분리**
  - 비즈니스 로직/상태는 전부 훅에 있고,  
    `AdminPage`/`CartPage`는 props를 통해서만 데이터를 받아 렌더링하는 UI 전용입니다.
  - **구현 완료**: 
    - `components/entities/*`에 엔티티 단위 컴포넌트를 생성하고,  
      `AdminPage`와 `CartPage`에서 이를 사용하도록 리팩터링 완료
      - `ProductCard`, `ProductRow` - 상품 엔티티 UI
      - `CartItemRow`, `CartSummary` - 장바구니 엔티티 UI
      - `CouponCard`, `CouponSelect` - 쿠폰 엔티티 UI
    - `components/features/*`에 기능 단위 컴포넌트를 생성하고,  
      `AdminPage`와 `CartPage`에서 이를 사용하도록 리팩터링 완료
      - `ProductListFeature`, `ProductAdminFeature` - 상품 관련 기능
      - `CartFeature` - 장바구니 기능
      - `CouponAdminFeature` - 쿠폰 관리 기능
  - 이제 페이지 컴포넌트는 features를 조합하는 역할만 수행하며,  
    각 기능은 features 레이어에서 독립적으로 관리됩니다.

- **29: 데이터 흐름에 맞는 계층구조**
  - **데이터/로직**: `hooks/*` (및 향후 `utils/*`)
  - **조합/도메인 규칙**: `App.tsx`
  - **페이지 UI**: `components/ui/*`
  - **기능 UI**: `components/features/*` (여러 entities를 조합하여 기능 단위로 제공)
  - **엔티티 UI**: `components/entities/*` (도메인 객체 하나를 표현)
  
  **데이터 흐름:**
  1. Hooks → 상태/비즈니스 로직 제공
  2. Features → Hooks를 사용하고 Entities를 조합하여 기능 완성
  3. Pages → Features를 레이아웃에 배치
  4. App → Pages를 조건부 렌더링

이 계층 덕분에:

- 새로운 UI를 붙일 때는 hooks를 재사용하면 되고,
- 새로운 비즈니스 규칙은 App 또는 별도 hook/util로 추가할 수 있으며,
- 각 레이어는 역할이 분명해 유지보수성이 좋아집니다.

---

## 6. Entities 컴포넌트 계층 (`components/entities`)

### 6.1 Entities 폴더의 역할과 설계 이유

**Entities 폴더는 도메인 객체(Product, CartItem, Coupon) 하나를 표현하는 작은 UI 조각들을 모아둔 곳입니다.**

#### 왜 Entities를 분리했는가?

1. **재사용성 향상**
   - 같은 `ProductCard`를 쇼핑몰 페이지, 관리자 페이지, 검색 결과 등 여러 곳에서 재사용 가능
   - 엔티티 단위로 UI가 분리되어 있으면, 새로운 화면을 만들 때 기존 컴포넌트를 그대로 가져다 쓸 수 있음

2. **관심사 분리 (Separation of Concerns)**
   - **데이터/비즈니스 로직**: `hooks/*` (상태 관리, 계산, 검증)
   - **엔티티 표현(UI)**: `components/entities/*` (하나의 도메인 객체를 어떻게 그릴지)
   - **기능 조합(UI)**: `components/features/*` (여러 엔티티를 묶어서 기능 단위 화면 구성)
   - **페이지 레이아웃**: `components/ui/*` (전체 페이지 구조)

3. **테스트 용이성**
   - 엔티티 컴포넌트는 props만 받는 순수 UI이므로,  
     비즈니스 로직 없이도 UI 렌더링/인터랙션만 독립적으로 테스트 가능

4. **유지보수성**
   - "상품 카드 디자인을 바꾸고 싶다" → `ProductCard.tsx`만 수정
   - "장바구니 아이템 표시 방식을 바꾸고 싶다" → `CartItemRow.tsx`만 수정
   - 각 엔티티의 UI 변경이 다른 부분에 영향을 최소화

#### Entities 컴포넌트의 특징

- **훅을 호출하지 않음**: 비즈니스 로직/상태 관리는 상위 컴포넌트에서 처리
- **Props 기반**: 데이터와 콜백만 props로 받아서 렌더링
- **도메인 단위**: 하나의 엔티티(Product, CartItem, Coupon)를 표현하는 데 집중

### 6.2 생성된 Entities 컴포넌트

#### Product 엔티티

- **`entities/product/ProductCard.tsx`**
  - 쇼핑몰 페이지의 상품 카드 UI
  - BEST 뱃지, 할인 배지, 재고 상태, 장바구니 담기 버튼 포함
  - Props: `product`, `remainingStock`, `formatPrice`, `onAddToCart`

- **`entities/product/ProductRow.tsx`**
  - 관리자 페이지의 상품 테이블 행
  - 수정/삭제 버튼 포함
  - Props: `product`, `formatPrice`, `onEdit`, `onDelete`

#### Cart 엔티티

- **`entities/cart/CartItemRow.tsx`**
  - 장바구니 아이템 하나를 표현하는 행
  - 수량 조절 버튼, 삭제 버튼, 할인율 표시 포함
  - Props: `item`, `itemTotal`, `discountRate`, `onRemove`, `onIncrease`, `onDecrease`

- **`entities/cart/CartSummary.tsx`**
  - 결제 정보 요약 영역
  - 총액, 할인 금액, 결제 버튼 포함
  - Props: `totals`, `onCompleteOrder`

#### Coupon 엔티티

- **`entities/coupon/CouponCard.tsx`**
  - 관리자 페이지의 쿠폰 카드
  - 쿠폰 정보 표시 및 삭제 버튼 포함
  - Props: `coupon`, `onDelete`

- **`entities/coupon/CouponSelect.tsx`**
  - 장바구니 페이지의 쿠폰 선택 드롭다운
  - Props: `coupons`, `selectedCode`, `onChange`

---

## 7. 구조 설계에 대한 질문과 답변

### Q1. "왜 feature에 hook이 들어가면 안되는거야?"

**A:** Feature 컴포넌트가 hook을 **사용**하는 것은 당연히 OK입니다.  
문제는 **hook의 구현(정의)을 feature 폴더 안에 넣는 것**입니다.

- **권장 구조**:
  - `hooks/useCart.ts` → hook **정의** (비즈니스 로직/상태)
  - `features/cart/CartFeature.tsx` → hook을 **사용**해서 UI 조합

- **피해야 할 구조**:
  - `features/cart/CartFeature.tsx` 안에 `useCart` 로직을 직접 구현

**이유:**
- 재사용성: 다른 화면(헤더 미니 카트, 모달 등)에서도 장바구니 로직이 필요할 때,  
  `hooks/useCart.ts`를 가져다 쓰면 되지만, feature 안에 있으면 꺼내 쓰기 어려움
- 테스트: 비즈니스 로직만 테스트하고 싶을 때, hook이 별도 파일에 있으면 쉬움
- 관심사 분리: "로직은 hooks", "UI 조합은 features"로 역할이 명확해짐

### Q2. "엔티티 자체가 데이터인데 UI를 표현하는게 맞는거야?"

**A:** 맞습니다. 엔티티(Entity)는 데이터/도메인 개념이고,  
`entities/` 폴더는 **"엔티티 데이터를 표현하는 UI 컴포넌트"**를 모아둔 곳입니다.

- **엔티티 (Entity)**: `Product`, `CartItem`, `Coupon` 같은 도메인 데이터/타입
- **엔티티 UI 컴포넌트**: `ProductCard`, `CartItemRow`, `CouponCard` 같은  
  "엔티티 하나를 화면에 어떻게 보여줄까?"를 담당하는 UI 조각

**예시:**
- `Product` (엔티티) → 타입/인터페이스, 비즈니스 규칙
- `ProductCard` (엔티티 UI) → `Product` 데이터를 받아서 카드 형태로 렌더링

이렇게 나누면:
- 도메인 로직 변경 → hooks/models 수정
- 화면 디자인 변경 → entities 컴포넌트 수정  
으로 영향 범위가 명확해집니다.

### Q3. "entities에 관련 데이터나 상태관리를 작성하고 features에서 UI를 조립하는 방식으로는 되는거아니야?"

**A:** 기술적으로는 가능하지만, 권장하지 않습니다.

**권장 구조:**
- **데이터/상태/비즈니스 로직** → `hooks/`, `models/`, `utils/`
- **엔티티 표현(UI)** → `entities/`
- **기능 조합(UI)** → `features/`

**이유:**
- 재사용성: 장바구니 로직을 다른 화면에서도 쓰고 싶을 때,  
  entities 안에 있으면 "UI 없이 로직만" 재사용하기 어려움
- 테스트: 비즈니스 로직과 렌더링이 섞이면 테스트가 복잡해짐
- 의도 명확성: `entities/`가 "도메인 UI인지, 도메인 로직인지" 애매해짐

**예외:**
- 순수 UI 상태 (카드 펼침/접힘, hover 상태 등)는 entities 안에 있어도 OK
- 하지만 도메인 상태(장바구니 품목, 상품 목록 등)는 hooks에 두는 것이 좋음

### Q4. "FSD의 설계와 비슷한가?"

**A:** 네, Feature-Sliced Design(FSD)의 사고방식과 매우 비슷합니다.

**FSD 레이어 vs 현재 구조:**
- `app/` → `App.tsx` (셸, 라우팅, 전역 프로바이더)
- `pages/` → `components/ui/*` (페이지 단위 UI)
- `features/` → (향후) `components/features/*` (기능 단위 UI 조합)
- `entities/` → `components/entities/*` (도메인 객체 단위 UI)
- `shared/` → `hooks/*`, `utils/*`, `types.ts` (공용 로직/타입)

현재 구조는 FSD를 TypeScript/React에 맞게 **가볍게 적용한 버전**이라고 볼 수 있습니다.

### Q5. "수평적 구조라고 볼 수 있을까 지금의 구조를?"

**A:** 완전한 수평 구조는 아니고, **수평 + 수직이 섞인 과도기 상태**입니다.

**수평 구조의 특징:**
- `components/`, `hooks/`, `utils/` 같은 기술 기반 분류만 있고
- 도메인 구분이나 계층(entities/features/pages)이 거의 없음

**현재 구조:**
- 수평: `hooks/`, `components/`, `utils/` 같은 기술 기반 분류
- 수직: `useCart`, `useProducts`, `AdminPage`, `CartPage` 같은 도메인/역할 분리
- 계층: `entities/`, `features/`, `ui/` 같은 레이어 구조

**결론:**
- 완전 수평도, 완전 수직도 아님
- **수평 구조를 쓰던 프로젝트를, 수직/레이어드 구조로 리팩터링 중인 과도기**라고 보는 것이 가장 정확

---

## 8. Features 컴포넌트 계층 (`components/features`)

### 8.0 작업 요약

**실행한 작업:**
1. `components/features/` 폴더 구조 생성
2. 3개의 Feature 컴포넌트 생성:
   - `features/product/ProductListFeature.tsx`
   - `features/product/ProductAdminFeature.tsx`
   - `features/coupon/CouponAdminFeature.tsx`
3. `CartPage.tsx`와 `AdminPage.tsx`를 features를 사용하도록 리팩터링
4. **수정**: `CartFeature`는 `CartPage`에서만 사용되므로 `CartPage`에 직접 포함 (재사용성 낮음)

**결과:**
- `CartPage.tsx`: 150줄 → 약 120줄 (entities 직접 사용)
- `AdminPage.tsx`: 450줄 → 100줄 (78% 감소)
- 페이지 컴포넌트가 features를 조합하거나 entities를 직접 사용하도록 구조화

---

### 8.1 Features 폴더의 역할과 설계 이유

**Features 폴더는 여러 entities를 조합하고, hooks를 사용하여 하나의 "기능 단위"로 사용자 경험을 제공하는 컴포넌트를 모아둔 곳입니다.**

#### 왜 Features를 분리했는가?

1. **기능 단위의 명확한 책임 분리**
   - "상품 리스트 보기", "장바구니 관리", "상품 관리", "쿠폰 관리" 같은 **사용자 관점의 기능**을 하나의 컴포넌트로 묶음
   - 각 기능이 독립적으로 관리되고 테스트 가능

2. **Entities와 Hooks의 조합 레이어**
   - **Entities**: 도메인 객체 하나를 표현하는 UI (ProductCard, CartItemRow 등)
   - **Features**: 여러 entities를 조합하고, hooks를 사용하여 완전한 기능을 제공
   - **Pages**: 여러 features를 레이아웃에 배치

3. **재사용성과 모듈화**
   - 같은 기능(예: 장바구니)을 다른 페이지(모달, 사이드바 등)에서도 재사용 가능
   - 기능 단위로 코드가 모듈화되어 유지보수가 쉬움

4. **페이지 컴포넌트의 단순화**
   - 페이지 컴포넌트는 이제 features를 배치하는 역할만 수행
   - 복잡한 로직이나 UI 조합은 features에서 처리

#### Features 컴포넌트의 특징

- **Hooks 사용**: 비즈니스 로직을 위해 hooks를 호출 (직접 정의하지 않음)
- **Entities 조합**: 여러 entities 컴포넌트를 조합하여 기능 완성
- **기능 단위**: 사용자가 하나의 작업을 완료할 수 있는 단위로 구성

### 8.2 생성된 Features 컴포넌트

#### Product Features

- **`features/product/ProductListFeature.tsx`**
  - 쇼핑몰 페이지의 상품 리스트 기능
  - 역할:
    - 상품 목록 헤더 (제목, 총 개수)
    - 검색 결과 없을 때 메시지 표시
    - `ProductCard` entities를 그리드로 렌더링
  - Props: `products`, `filteredProducts`, `debouncedSearchTerm`, `formatPrice`, `getRemainingStock`, `onAddToCart`
  - 사용 위치: `CartPage`의 좌측 영역

- **`features/product/ProductAdminFeature.tsx`**
  - 관리자 페이지의 상품 관리 탭 기능
  - 역할:
    - 상품 테이블 (헤더, `ProductRow` entities)
    - "새 상품 추가" 버튼
    - 상품 추가/수정 폼 (이름, 가격, 재고, 설명, 할인 정책)
  - Props: `products`, `formatPrice`, `showProductForm`, `editingProduct`, `productForm`, `startEditProduct`, `deleteProduct`, `handleProductSubmit`, `addNotification` 등
  - 사용 위치: `AdminPage`의 상품 관리 탭

#### Cart Features

- **`CartFeature`는 생성하지 않음**
  - 이유: `CartPage`에서만 사용되고 재사용 가능성이 낮음
  - 대신: `CartPage`에서 `CartItemRow`, `CartSummary`, `CouponSelect` entities를 직접 사용
  - 장바구니 기능이 다른 곳(모달, 사이드바 등)에서도 필요해지면 그때 `CartFeature`를 생성

#### Coupon Features

- **`features/coupon/CouponAdminFeature.tsx`**
  - 관리자 페이지의 쿠폰 관리 탭 기능
  - 역할:
    - 쿠폰 관리 헤더
    - `CouponCard` entities를 그리드로 렌더링
    - "새 쿠폰 추가" 버튼
    - 쿠폰 생성 폼 (쿠폰명, 코드, 할인 타입, 할인 값)
  - Props: `coupons`, `showCouponForm`, `couponForm`, `deleteCoupon`, `handleCouponSubmit`, `addNotification` 등
  - 사용 위치: `AdminPage`의 쿠폰 관리 탭

### 8.3 Features 리팩터링 결과

#### CartPage.tsx 리팩터링

**이전 구조:**
- 상품 리스트와 장바구니 UI가 모두 페이지 컴포넌트 안에 직접 구현
- 약 150줄의 코드

**리팩터링 후:**
- `ProductListFeature`를 사용 (재사용 가능한 기능)
- 장바구니는 `CartPage`에서 entities(`CartItemRow`, `CartSummary`, `CouponSelect`)를 직접 사용
- 약 120줄로 감소 (약 30줄 감소, 20% 감소)

```tsx
// 리팩터링 후 CartPage.tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">
    <ProductListFeature {...productListProps} />
  </div>
  <div className="lg:col-span-1">
    {/* CartFeature 대신 entities 직접 사용 */}
    <CartItemRow ... />
    <CouponSelect ... />
    <CartSummary ... />
  </div>
</div>
```

**왜 CartFeature를 만들지 않았나?**
- `CartPage`에서만 사용되고 재사용 가능성이 낮음
- YAGNI 원칙: "You Aren't Gonna Need It" - 필요할 때까지 만들지 않음
- 나중에 헤더 미니 장바구니나 모달에서도 필요해지면 그때 `CartFeature`를 생성

#### AdminPage.tsx 리팩터링

**이전 구조:**
- 상품 관리 탭과 쿠폰 관리 탭의 모든 UI가 페이지 컴포넌트 안에 직접 구현
- 약 450줄의 코드

**리팩터링 후:**
- `ProductAdminFeature`와 `CouponAdminFeature`를 사용
- 약 100줄로 감소 (약 350줄 감소, 78% 감소)

```tsx
// 리팩터링 후 AdminPage.tsx
{activeTab === 'products' ? (
  <ProductAdminFeature {...productAdminProps} />
) : (
  <CouponAdminFeature {...couponAdminProps} />
)}
```

### 8.4 Features를 나눈 이유 (구조 설계 근거)

#### 1. 관심사 분리 (Separation of Concerns)

**문제점:**
- 페이지 컴포넌트에 모든 UI와 로직이 섞여 있음
- "상품 리스트를 수정하고 싶다" → CartPage 전체를 읽어야 함
- "장바구니 UI를 바꾸고 싶다" → CartPage 전체를 읽어야 함

**해결책:**
- 재사용 가능한 기능은 features로 분리 (`ProductListFeature`)
- 페이지 전용 기능은 entities를 직접 사용 (`CartPage`의 장바구니)
- "상품 리스트 수정" → `ProductListFeature.tsx`만 수정
- "장바구니 UI 변경" → `CartPage.tsx`의 해당 부분만 수정 (또는 entities 수정)

#### 2. 재사용성 향상

**시나리오:**
- 장바구니 기능을 모달이나 사이드바에서도 사용하고 싶을 때
- 상품 리스트를 검색 결과 페이지에서도 사용하고 싶을 때

**해결책:**
- `CartFeature`를 다른 페이지에서도 import해서 사용 가능
- `ProductListFeature`를 다른 페이지에서도 재사용 가능

#### 3. 테스트 용이성

**이전:**
- 장바구니 기능만 테스트하고 싶어도 `CartPage` 전체를 렌더링해야 함
- 상품 관리 기능만 테스트하고 싶어도 `AdminPage` 전체를 렌더링해야 함

**이후:**
- `CartFeature`만 독립적으로 테스트 가능
- `ProductAdminFeature`만 독립적으로 테스트 가능
- 각 feature의 props만 mock하면 됨

#### 4. 코드 가독성과 유지보수성

**이전:**
- CartPage: 150줄의 복잡한 JSX
- AdminPage: 450줄의 복잡한 JSX
- "어디를 수정해야 하나?" 찾기 어려움

**이후:**
- CartPage: 50줄의 간단한 레이아웃 코드
- AdminPage: 100줄의 간단한 레이아웃 코드
- 각 feature 파일이 명확한 책임을 가짐

#### 5. 계층 구조의 완성

**최종 계층 구조:**

```
App.tsx (셸)
  ↓
Pages (ui/)
  - CartPage
  - AdminPage
    ↓
Features (features/)
  - ProductListFeature
  - CartFeature
  - ProductAdminFeature
  - CouponAdminFeature
    ↓
Entities (entities/)
  - ProductCard
  - CartItemRow
  - CouponCard
  ...
    ↓
Hooks (hooks/)
  - useCart
  - useProducts
  - useCoupons
```

**데이터 흐름:**
1. **Hooks** → 상태/비즈니스 로직 제공
2. **Features** → Hooks를 사용하고 Entities를 조합하여 기능 완성
3. **Pages** → Features를 레이아웃에 배치
4. **App** → Pages를 조건부 렌더링

이 계층 구조 덕분에:
- 각 레이어의 책임이 명확함
- 코드 변경의 영향 범위가 제한됨
- 새로운 기능 추가가 쉬움

---

## 9. 앞으로의 확장 방향 (권장)

현재 구조 위에서 다음과 같은 확장을 고려할 수 있습니다:

- `components/features/`  
  - `cart/CartFeature.tsx` (장바구니 영역 전체)  
  - `product/ProductListFeature.tsx` (상품 리스트+검색 헤더)  
  - `coupon/CouponAdminFeature.tsx` (관리자 쿠폰 탭)
  - 여기서 `useCart`, `useProducts`, `useCoupons` 등 훅을 조합해  
    하나의 "기능" 단위로 사용자 경험을 제공.

- `utils/`  
  - `cartCalculations.ts`, `validators.ts`, `formatters.ts` 등으로 순수 계산/검증 함수 모음.

이 문서는 현재 구조의 의도를 설명하기 위한 것이며,  
팀 합의에 따라 필요 시 업데이트하거나 세부 구조를 더 쪼갤 수 있습니다.


