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
https://youngh02.github.io/front_7th_chapter3-2/

이번 과제를 통해 "읽기 좋은 코드"와 "좋은 설계"가 무엇인지 깊이 고민하는 시간을 가졌습니다. 특히 거대한 컴포넌트를 분리하면서 어디까지 나눠야 적절한지, 과도한 분리는 아닌지 끊임없이 고민했습니다. 관심사 분리의 원칙을 지키면서도 실용성을 잃지 않는 균형점을 찾는 것이 가장 어려웠고, 그 과정에서 많은 것을 배울 수 있었습니다.

<!-- 과제에 대한 회고를 작성해주세요 -->

### 과제를 하면서 내가 알게된 점, 좋았던 점은 무엇인가요?
**관심사 분리의 실질적인 효과**

처음 1000줄이 넘는 거대한 App.tsx를 마주했을 때는 막막했지만, 단계적으로 분리하면서 각 계층의 역할이 명확해지는 것을 체감했습니다. Model(순수 함수) → Hook(상태 관리) → Component(렌더링)로 분리하니 각 부분을 독립적으로 테스트하고 수정할 수 있었고, 코드의 흐름을 파악하기도 훨씬 수월해졌습니다.


**컴포넌트 계층 설계의 중요성**

Feature 컴포넌트는 Hook을 직접 사용하고, UI 컴포넌트는 Props로 데이터를 받는 패턴을 적용하면서 재사용성과 테스트 용이성이 크게 향상되는 것을 경험했습니다. 특히 `ProductCard`, `CartItem` 같은 작은 UI 컴포넌트들이 여러 곳에서 재사용되는 모습을 보며, 처음부터 계층을 잘 설계하는 것이 얼마나 중요한지 깨달았습니다.


### 이번 과제에서 내가 제일 신경 쓴 부분은 무엇인가요?
**1. 적절한 추상화 레벨 찾기**

힌트 코드보다 더 많은 models와 hooks로 분리했는데, 너무 세분화하면 오히려 복잡도가 증가할 수 있다는 고민이 있었습니다. 예를 들어 `cart.ts`, `product.ts`, `coupon.ts`, `discount.ts`로 나누고, hooks도 각각 분리했는데, 이것이 과도한 분리인지 아니면 단일 책임 원칙에 더 부합하는 구조인지 계속 고민했습니다.

**2. Props 전달 패턴의 일관성**

UI 컴포넌트에 Props를 전달할 때, 모든 핸들러를 개별적으로 전달하는 방식과 통합 핸들러를 사용하는 방식 사이에서 고민이 많았습니다. 예를 들어 `CouponForm`에 `onNameChange`, `onCodeChange` 등을 각각 전달하는 것이 명시적이긴 하지만, Props가 너무 많아져서 가독성이 떨어지는 것 같았습니다. 명시성과 간결함 사이의 균형을 어떻게 맞춰야 할지 고민이 깊었습니다.

**3. 폴더 구조와 파일 분산**

`_common`, `_icons` 같이 언더스코어를 붙여서 일반 도메인 폴더와 구분했는데, 이것이 최선의 방법인지 확신이 서지 않았습니다. 또한 도메인별 구조(`cartPage/`, `adminPage/`)와 기능별 구조(`features/`) 중 어떤 것이 더 확장성이 좋을지 고민했습니다. 특히 하나의 엔티티(예: cart)와 관련된 파일들이 `models/cart.ts`, `hooks/useCart.ts`, `components/cartPage/` 등 여러 폴더에 흩어져 있어서, 이것이 올바른 구조인지 의문이 들었습니다.


### 이번 과제를 통해 앞으로 해보고 싶은게 있다면 알려주세요!

### 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문 편하게 남겨주세요 :)

**1. 파일 분리 수준과 디렉토리 구조**

힌트 코드보다 더 많은 models와 hooks로 분리했는데, 이것이 적절한 수준인지 궁금합니다.

현재 구조:

```
src/basic/
├── models/
│   ├── cart.ts
│   ├── product.ts
│   ├── coupon.ts
│   └── discount.ts
├── hooks/
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useCoupons.ts
│   └── useDiscount.ts
└── components/
    ├── _common/
    ├── _icons/
    ├── cartPage/
    └── adminPage/
```

- 이렇게 세분화하는 것이 단일 책임 원칙에 더 부합하는 건지, 아니면 과도한 분리로 오히려 복잡도만 증가시키는 건지 궁금합니다.
- 하나의 엔티티(예: cart)와 관련된 파일들이 `models/cart.ts`, `hooks/useCart.ts`, `components/cartPage/` 등 여러 폴더에 흩어져 있는데, 이것이 올바른 구조인가요? 아니면 feature-based 구조로 `features/cart/` 안에 모아두는 것이 더 나을까요?
- 모든 비즈니스 로직과 상태 관리가 hooks로 빠지는 것이 맞는 건가요? 어디까지 분리해야 적절한지 기준이 궁금합니다.


2. Props 전달 패턴
basic에서 관심사를 분리하고자 모든 로직을 이렇게 props로 전달하는게 맞을까요?

```tsx
<CouponForm
  couponForm={couponForm}
  onNameChange={(value) => handleChange("name", value)}
  onCodeChange={(value) => handleChange("code", value, formatCouponCode)}
  onDiscountTypeChange={(value) => handleChange("discountType", value)}
  onDiscountValueChange={(value) =>
    handleChange("discountValue", parseDiscountValue(value))
  }
  onSubmit={handleCouponSubmit}
  onCancel={() => setShowCouponForm(false)}
/>
```
- 이렇게 하면 명시적이긴 하지만 Props가 너무 많아집니다.
- 대안으로 하나의 `onChange` 핸들러로 통합하거나, `useForm` Hook을 만들어서 컴포넌트 내부에서 상태를 관리하는 방법도 있는데, 어떤 방식이 더 나은 설계일까요?
- UI 컴포넌트의 재사용성을 위해서는 Props로 받는 것이 맞지만, 너무 많은 Props는 오히려 사용하기 어렵게 만드는 것 같습니다. 적절한 균형점은 어디일까요?

3. Event Emitter 패턴 사용
localStorage 동기화를 위해 Event Emitter 패턴(Pub/Sub)을 사용했습니다:
```tsx
// 발행
window.dispatchEvent(new Event('cart-updated'));

// 구독
window.addEventListener('cart-updated', handleUpdate);
```
이 방식이 Hook 내부에서 사용하기에 적절한지 궁금합니다.
- Event Emitter는 상태관리 라이브러리는 아닌 것 같은데, hooks 내부에서 이렇게 사용해도 괜찮은가요?
- Context API나 Zustand 같은 상태관리 라이브러리를 사용하는 것이 더 나은 선택일까요?
- Event Emitter 패턴의 적절한 사용 범위는 어디까지인지, 그리고 언제 상태관리 라이브러리로 전환해야 하는지 기준이 궁금합니다.

