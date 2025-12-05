# Frontend Refactoring Guide  
(Design Pattern + Functional Programming 기준)

이 문서는 본 프로젝트의 대규모 리팩토링(App.tsx 1000+ lines)을 수행할 때  
**모든 컴포넌트를 일관된 기준으로 분리하기 위해 작성된 가이드라인입니다.**

---

# 1. 리팩토링 전체 목표

### ✔ 엔티티 중심 계층 분리  
README 명시 기준  
- 엔티티를 다루는 것과 아닌 것을 명확히 구분한다  
  - 엔티티 상태 예: cart, product, coupon  
  - 비엔티티 상태 예: isShowPopup, 검색창 value  
- 엔티티 컴포넌트 vs UI 컴포넌트 분리  
- 엔티티 훅(useCart, useProduct, useCoupon) 분리  
- 엔티티 계산 함수(calculate*, getMaxApplicableDiscount 등) 분리

### ✔ UI는 순수하게 만들기 (FP 원칙)
- UI 컴포넌트는 "표현"만 담당한다  
- 상태/도메인/비즈니스 로직/데이터 구조 몰라야 함  
- props = 값 + 이벤트 핸들러만 받는다  
- side-effect 없음

### ✔ Container - Presenter(Presentational) 패턴 적용
- Container: 상태/비즈니스 로직/도메인 판단 담당  
- Presenter(UI): 렌더링만 담당  

### ✔ 테스트 통과 구조 만들기
- 계산 로직, 상태 로직, UI 분리하면 테스트 가능해짐

### ✔ Props Drilling 제거(심화)
- 전역 상태(Zustand, Jotai, Context 중 택 1)
- 불필요한 props 제거

---

# 2. 컴포넌트 분류 기준

## ✅ (1) UI Component (순수 UI)
- 도메인 모름  
- 엔티티 모름  
- 상태 없음  
- props로 받은 값만 렌더링  
- props로 받은 핸들러만 호출  
- 재사용 가능  
- 스타일/구조 중심

**예)** Button, Input, Badge, Modal, Layout, Grid, Table…

---

## ✅ (2) Entity Component (도메인 컴포넌트)
- 특정 엔티티(cart, product, coupon)를 직접 다룸  
- useCart, useProduct 등 엔티티 훅을 사용  
- 비즈니스 판단을 내부에서 수행  
- 로직이 들어있지만 UI도 포함될 수 있음  
- 다만 UI는 최대한 presenter로 분리하는 것이 이상적

**예)**  
CartItemView, ProductCard, CouponSection…

---

## ✅ (3) Function / Util (순수 함수)
- 데이터만 입력 → 새로운 데이터만 반환 (순수함수)  
- 외부 상태 접근 X  
- 계산/가공 책임만 있음

README 요구 예:
- calculateItemTotal  
- calculateCartTotal  
- getMaxApplicableDiscount  
- updateCartItemQuantity  

---

## ✅ (4) Custom Hook (상태/비즈니스 로직)
- 비즈니스 로직 + 상태 관리  
- API 연동 or 로컬 저장 등 side-effect 포함 가능  
- 도메인 단위로 묶기 (useCart, useProduct, useCoupon 등)

---

# 3. 리팩토링 절차 (단계별)

## 🔥 Step 1) 구조적 분리  
> “실제로 로직을 UI에서 제거하는 단계”

- App.tsx에서  
  - 상태  
  - 로직  
  - 엔티티 접근  
  - API 호출  
  - 조건 분기  
  모두 분리한다  
- Presenter(UI)에는 **로직 없는 코드만 남긴다**

---

## 🔥 Step 2) 의미적 책임 분리 (네이밍 관점)
> “UI가 도메인을 모르게 만드는 단계”

예:  
- searchTerm → value  
- setSearchTerm → onChange  
- isAdmin → isActive  
- onAdminToggle → onToggle  

이름이 UI 레이어의 책임과 일관되도록 변경

---

## 🔥 Step 3) 엔티티 및 훅 분리
README 기준:
- useCart, useProduct, useCoupon 등 로직을 훅으로 이동  
- 계산 로직을 util로 이동  
- 엔티티 컴포넌트(ProductCard, Cart 등)를 별도 폴더 구조로 이동

---

## 🔥 Step 4) Props Drilling 제거(심화)
README 기준:
- Jotai / Zustand / Context 중 하나 선택  
- 전역 상태로 공유  
- Presenter는 props를 최소화

---

# 4. 폴더 구조 제안

