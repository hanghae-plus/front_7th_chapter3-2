## 과제의 핵심취지

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- 액션과 순수함수의 분리

## 과제에서 꼭 알아가길 바라는 점

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

### 기본과제

- Component에서 비즈니스 로직을 분리하기
- 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기
- 뷰데이터와 엔티티데이터의 분리에 대한 이해
- entities -> features -> UI 계층에 대한 이해

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

### 심화과제

- 이번 심화과제는 Context나 Jotai를 사용해서 Props drilling을 없애는 것입니다.
- 어떤 props는 남겨야 하는지, 어떤 props는 제거해야 하는지에 대한 기준을 세워보세요.
- Context나 Jotai를 사용하여 상태를 관리하는 방법을 익히고, 이를 통해 컴포넌트 간의 데이터 전달을 효율적으로 처리할 수 있습니다.

- [x] Context나 Jotai를 사용해서 전역상태관리를 구축했나요?
- [x] 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링 했나요?
- [x] 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거했나요?
- [x] 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드가 되었나요?

## 과제 셀프회고

+12-1
AI 페어 프로그래밍을 위한 에이전트 설정 및 프로젝트 구조 파악

+12-2
기본과제 구조 설계 및 scaffolding, useLocalStorage 훅과 Pub/Sub 패턴 기반 toast 시스템 구현

+12-3
useProducts, useCoupons, useCart 훅 완성 및 cart.ts 순수 함수 분리, 컴포넌트 계층 구조 정리

+12-4
심화과제 Jotai 도입, 4개 atom 파일 구현 (ui/product/coupon/cart), Props drilling 완전 제거

<!-- 과제에 대한 회고를 작성해주세요 -->

### 과제를 하면서 내가 알게된 점, 좋았던 점은 무엇인가요?

**엔티티 중심 설계의 중요성**을 체감했습니다. cart, product, coupon 각각의 도메인별로 순수 함수(models/)와 상태 관리(hooks/ 또는 atoms/)를 분리하니 코드의 책임이 명확해졌습니다. 특히 `calculateCartTotal`, `getRemainingStock` 같은 순수 함수들은 테스트하기 쉽고 재사용성이 높았습니다.

Jotai의 `atomWithStorage`와 action atom 패턴을 통해 **useState + useCallback 조합보다 훨씬 간결하게** 전역 상태를 관리할 수 있다는 점을 알게 되었습니다.

### 이번 과제에서 내가 제일 신경 쓴 부분은 무엇인가요?

**Props drilling 제거 시 어떤 props를 남기고 어떤 것을 제거할지 기준을 세우는 것**에 가장 신경 썼습니다.

- **제거한 props**: 전역 상태(cart, products, coupons)와 그에 대한 action 함수들
- **남긴 props**: 컴포넌트 로컬 상태 관련(editingProduct, productForm 등 폼 상태)

결과적으로 App.tsx의 props가 14개 → 0개로 줄었고, 각 컴포넌트가 필요한 atom만 직접 구독하도록 개선했습니다.

### 이번 과제를 통해 앞으로 해보고 싶은게 있다면 알려주세요!

- 순수 함수와 부수효과(toast, API 호출)를 분리하는 이유와 방법론에 대한 학습
- 커스텀 훅과 atom의 역할 구분 기준 정립
- React Query와 Jotai 조합으로 서버 상태와 클라이언트 상태 분리

### 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문 편하게 남겨주세요 :)

1. 폼 상태(editingProduct, productForm)를 선언한 컴포넌트와 자식 컴포넌트에서만 사용하여 로컬상태로 두었는데요. 폼 상태의 경우 이 처럼 로컬에 두는 것과 전역으로 올리는 것 중 어떠한 방법이 더 효율적일지 궁금합니다.

2. `atomWithStorage` 사용 시 테스트 환경에서 `createStore()`로 격리하는 방식 외에 더 좋은 패턴이 있는지 알고 싶습니다.
